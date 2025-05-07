import { Router } from 'express'
import healthController from '../controller/Health/health.controller.js'
import authController from '../controller/Authentication/auth.controller.js'
import rateLimit from '../middleware/rateLimit.js'
import authentication from '../middleware/authentication.js'

const router = Router()

router.route('/self').get(healthController.self)
router.route('/health').get(healthController.health)

router.route('/register').post(rateLimit, authController.register)
router.route('/confirmation/:token/').get(rateLimit,authController.confirmPassword)
router.route('/login').post(rateLimit, authController.login)
router.route('/logout').get(authentication, authController.logout)
router.route('/self-identification').get(authentication,authController.selfIdentification)
router.route('/forgot-password').post(rateLimit, authController.forgotPassword)
router.route('/reset-password/:token').post(rateLimit, authController.resetPassword)
router.route('/change-password').post(authentication, authController.changePassword)

export default router