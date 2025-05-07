import responseMessage from "../../constant/responseMessage.js";
import httpError from "../../util/httpError.js";
import httpResponse from "../../util/httpResponse.js";
import quicker from "../../util/quicker.js";
import { loginRequestBody, registerRequestBody, validateJoiSchema } from '../../service/validation.service.js';
import userModel from '../../models/user.model.js';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import config from '../../config/config.js';
import emailService from '../../service/email.service.js';
import { EApplicationEnvironment, EUserRole } from '../../constant/application.js';
import logger from '../../util/logger.js';
import { generateAccountConfirmedHtml, generateConfirmationEmailHtml, generatePasswordChangedHtml, generatePasswordResetHtml, generatePasswordResetRequestHtml } from '../../util/email.formatter.js';

dayjs.extend(utc)

export default {
    self: (req, res, next) => {
        try {
            httpResponse(req, res, 200, responseMessage.customMessage('Authentication service is working'));
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    register : async (req, res, next) => {
        try {
            const { body } = req;
            const { error, value } = validateJoiSchema(registerRequestBody, body);
            if (error) return httpError(next, error, req, 422);
    
            const { name, emailAddress, phoneNumber, password, consent, role, lat, long } = value;
    
            const existingUser = await userModel.findOne({ emailAddress }).select('');
            if (existingUser) return httpError(next, new Error(responseMessage.AUTH.ALREADY_EXIST('user', emailAddress)), req, 403);
    
            const { countryCode, isoCode, internationalNumber } = quicker.parsePhoneNumber(`+${phoneNumber}`);
            if (!countryCode || !isoCode || !internationalNumber) {
                return httpError(next, new Error(responseMessage.AUTH.INVALID_PHONE_NUMBER), req, 422);
            }
    
            const timezone = quicker.countryTimezone(isoCode);
            if (!timezone || timezone.length === 0) {
                return httpError(next, new Error(responseMessage.AUTH.INVALID_PHONE_NUMBER), req, 422);
            }
    
            const hashedPassword = await quicker.hashPassword(password);
            const token = quicker.generateRandomId();
            const code = quicker.generateOtp(6);
    
            const newUser = {
                name,
                emailAddress,
                phoneNumber: { countryCode, isoCode, internationalNumber },
                accountConfirmation: { status: false, token, code, timestamp: null },
                passwordReset: { token: null, expiry: null, lastResetAt: null },
                userLocation: { lat, long },
                lastLoginAt: null,
                role: role || EUserRole.USER,
                timezone: timezone[0]?.name || 'UTC',
                password: hashedPassword,
                consent
            };
    
            const saveUser = await userModel.create(newUser);
            if (!saveUser) {
                return httpError(next, new Error(responseMessage.COMMON.FAILED_TO_SAVE('User')), req, 500);
            }

            const confirmationUrl = `${config.FRONTEND_URL}app/confirmation/${token}/?code=${code}`
            const to = [emailAddress]
            const subject = 'Confirm Your Account'
            const text = `Hey ${emailAddress}, Please confirm your account by clicking on the link below\n\n${confirmationUrl}`

            const html = generateConfirmationEmailHtml(emailAddress, confirmationUrl);

            emailService.sendEmail(to, subject, text, html).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    meta: err,
                });
            });
    
            httpResponse(req, res, 200, responseMessage.SUCCESS);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    confirmPassword: async (req, res, next) => {
        try {
            const { params, query } = req 

            const { token } = params
            const { code } = query
    
            const user = await userModel.findOne({
                'accountConfirmation.token': token,
                'accountConfirmation.code': code
            })
    
            if (!user) {
                return httpError(next, new Error(responseMessage.AUTH.TOKEN_INVALID), req, 400)
            }
    
            if (user.accountConfirmation.status) {
                return httpError(next, new Error(responseMessage.AUTH.ACCOUNT_ALREADY_CONFIRMED), req, 409)
            }
    
            user.accountConfirmation.status = true
            user.accountConfirmation.timestamp = dayjs().utc().toDate()
    
            await user.save()

            const to = [user.emailAddress]
            const subject = 'Account Confirmed'
            const text = `Your account has been confirmed`

            const html = generateAccountConfirmedHtml();

            emailService.sendEmail(to, subject, text, html).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    meta: err,
                });
            });

            httpResponse(req, res, 200, responseMessage.SUCCESS)   
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    login: async (req,res,next) => {
        try {
            const { body } = req;
            const { error, value } = validateJoiSchema(loginRequestBody, body);
            if (error) return httpError(next, error, req, 422);

            const { emailAddress, password } = value;

            const user = await userModel.findOne({ emailAddress }).select('+password');

            if (!user) return httpError(next, new Error(responseMessage.ERROR.NOT_FOUND('User')), req, 404);

            const isMatch = await quicker.comparePassword(password, user.password);

            if (!isMatch) return httpError(next, new Error(responseMessage.AUTH.LOGIN_FAILED), req, 401);


            const accessToken = quicker.generateToken(
                {
                    userId: user._id
                },
                config.auth.jwtSecret,
                config.auth.jwtExpiresIn
            )

            user.lastLogin = dayjs().utc().toDate()
            user.isActive = true
            await user.save()

            const DOMAIN = quicker.getDomainFromUrl(config.SERVER_URL)

            res.cookie('accessToken', accessToken, {
                path: EApplicationEnvironment.DEVELOPMENT ? '/v1' : '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * config.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(config.env === EApplicationEnvironment.DEVELOPMENT)
            })
            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                accessToken
            })
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    logout: async (req, res, next) => {
        try {
            let accessToken

            const { cookies } = req
            if (cookies?.accessToken) {
                accessToken = cookies.accessToken
            }
            
            const authHeader = req.headers.authorization
            if (!accessToken && authHeader?.startsWith('Bearer ')) {
                accessToken = authHeader.substring(7)
            }

            const { userId } = quicker.verifyToken(accessToken, config.auth.jwtSecret)
            const user = await userModel.findById(userId);

            if (!user) {
                return httpError(next, new Error(responseMessage.ERROR.NOT_FOUND('user')), req, 404)
            }

            user.isActive = false
            await user.save()

            const DOMAIN = quicker.getDomainFromUrl(config.SERVER_URL)

            res.clearCookie('accessToken', {
                path: EApplicationEnvironment.DEVELOPMENT ? '/v1' : '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                httpOnly: true,
                secure: config.ENV !== EApplicationEnvironment.DEVELOPMENT
            })
            
            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    selfIdentification: async (req, res, next) => {
        try {
            const { authenticatedUser } = req
            httpResponse(req, res, 200, responseMessage.SUCCESS, authenticatedUser)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            
            const { emailAddress } = req.body

            if(!emailAddress){
                return httpError(next, new Error(responseMessage.COMMON.INVALID_PARAMETERS('emailAddress')), req, 400)
            }

            const user = await userModel.findOne({ emailAddress: emailAddress})
            if (!user) {
                return httpError(next, new Error(responseMessage.ERROR.NOT_FOUND('user')), req, 404)
            }

            if (!user.accountConfirmation.status) {
                return httpError(next, new Error(responseMessage.AUTH.ACCOUNT_NOT_CONFIRMED), req, 400)
            }

            const token = quicker.generateRandomId()
            const expiry = quicker.generateResetPasswordExpiry(15)

            user.passwordReset.token = token
            user.passwordReset.expiry = expiry

            await user.save()

            const resetUrl = `${config.FRONTEND_URL}app/reset-password/${token}`
            const to = [emailAddress]
            const subject = 'Account Password Reset Requested'
            const text = `Hey ${user.name}, Please reset your account password by clicking on the link below\n\nLink will expire within 15 Minutes\n\n${resetUrl}`

            const html = generatePasswordResetRequestHtml(user.emailAddress, resetUrl);

            emailService.sendEmail(to, subject, text, html).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    meta: err, 
                });
            });

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            const { body, params } = req

            const { token } = params

            const { newPassword } = body

            if(!newPassword || newPassword.length < 8){
                return httpError(next, new Error(responseMessage.COMMON.INVALID_PARAMETERS('newPassword')), req, 400)
            }

            const user = await userModel.findOne({
                'passwordReset.token': token
            })
            if (!user) {
                return httpError(next, new Error(responseMessage.COMMON.NOT_FOUND('user')), req, 404)
            }

            if (!user.accountConfirmation.status) {
                return httpError(next, new Error(responseMessage.AUTH.ACCOUNT_NOT_CONFIRMED), req, 400)
            }

            const storedExpiry = user.passwordReset.expiry
            const currentTimestamp = dayjs().valueOf()

            if (!storedExpiry) {
                return httpError(next, new Error(responseMessage.COMMON.ACTION_NOT_ALLOWED), req, 400)
            }

            if (currentTimestamp > storedExpiry) {
                return httpError(next, new Error(responseMessage.customMessage('Link is invalid')), req, 400)
            }

            const hashedPassword = await quicker.hashPassword(newPassword)

            user.password = hashedPassword

            user.passwordReset.token = null
            user.passwordReset.expiry = null
            user.passwordReset.lastResetAt = dayjs().utc().toDate()
            await user.save()

            const to = [user.emailAddress]
            const subject = 'Account Password Reset'
            const text = `Hey ${user.name}, You account password has been reset successfully.`

            const html = generatePasswordResetHtml(user.emailAddress);

            emailService.sendEmail(to, subject, text, html).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    meta: err, 
                });
            });

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    changePassword: async (req, res, next) => {
        try {
            const { body, authenticatedUser } = req

            const { newPassword, oldPassword } = body

            if (!newPassword || newPassword.length < 8) {
                return httpError(next, new Error(responseMessage.COMMON.INVALID_PARAMETERS), req, 400)
            }
            if (!oldPassword) {
                return httpError(next, new Error(responseMessage.COMMON.INVALID_PARAMETERS), req, 400)
            }

            const user = await userModel.findById(
                authenticatedUser._id
            ).select('+password')

            
            if (!user) {
                return httpError(next, new Error(responseMessage.ERROR.NOT_FOUND('user')), req, 404)
            }

            if (!user.password) {
                return httpError(next, new Error(responseMessage.AUTH.ACCOUNT_NOT_CONFIRMED), req, 400)
            }

            const isPasswordMatching = await quicker.comparePassword(oldPassword, user.password)
            if (!isPasswordMatching) {
                return httpError(next, new Error(responseMessage.OPERATION_FAILED('Reset password')), req, 400)
            }

            if (newPassword === oldPassword) {
                return httpError(next, new Error(responseMessage.customMessage('Reset password and Old password is same')), req, 400)
            }

            const hashedPassword = await quicker.hashPassword(newPassword)

            user.password = hashedPassword
            await user.save()

            const to = [user.emailAddress]
            const subject = 'Password Changed'
            const text = `Hey ${user.emailAddress}, You account password has been changed successfully.`

            const html = generatePasswordChangedHtml(user.emailAddress);

            emailService.sendEmail(to, subject, text, html).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    meta: err,
                });
            });

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    }
};