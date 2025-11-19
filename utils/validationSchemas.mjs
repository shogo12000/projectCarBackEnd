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

export const addCarSchema = checkSchema({
  userId: {
    in: ["body"],
  },
  brand: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Brand is required",
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "Brand must be at least 2 characters",
    },
    trim: true,
  },
  model: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Model is required",
    },
    isLength: {
      options: { min: 1 },
      errorMessage: "Model must be at least 1 character",
    },
    trim: true,
  },
  year: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Year is required",
    },
    isInt: {
      options: { min: 1900, max: 2026 },
      errorMessage: "Year must be a number between 1900 and 2025",
    },
  },
  price: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Price is required",
    },
    isFloat: {
      options: { min: 0 },
      errorMessage: "Price must be a positive number",
    },
  },
});