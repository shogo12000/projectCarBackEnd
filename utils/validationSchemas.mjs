import { checkSchema } from "express-validator";

export const loginSchema = checkSchema({
    email: {
        in: ['body'],
        notEmpty: {
            errorMessage: "Email is required"
        },
        isEmail: {
            errorMessage: "Email must be valid",
        },
        trim: true,
        normalizeEmail: true,
    },
    password: {
        in: ['body'],
        isLength: {
            options: { min: 3 },
            errorMessage: 'Password should be at least 8 chars',
        }
    }
})

export const registerSchema = checkSchema({
    email: {
        in: ['body'],
        notEmpty: {
            errorMessage: "Email is required"
        },
        isEmail: {
            errorMessage: "Email must be valid"
        },
        trim: true,
        normalizeEmail: true,
    },
    username: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Username must be at least 3 characters long",
        },
        trim: true,
    },
    password: {
        in: ['body'],
        isLength: {
            options: { min: 3 },
            errorMessage: 'Password should be at least 8 chars',
        }
    }
})