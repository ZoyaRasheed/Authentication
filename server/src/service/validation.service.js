import Joi from 'joi'
import { EUserRole } from '../constant/application.js'

export const registerRequestBody = Joi.object({
    name: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().min(8).required(),
    consent: Joi.boolean().required(),
    role: Joi.string()
        .valid(...Object.values(EUserRole))
        .optional(),
    lat: Joi.number().required(),
    long: Joi.number().required()
})

export const loginRequestBody = Joi.object({
    emailAddress: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})

export const validateJoiSchema = (schema, value) => {
    const result = schema.validate(value)
    return {
        value: result.value,
        error: result.error
    }
}