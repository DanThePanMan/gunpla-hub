// middleware/validators.js
const { body } = require("express-validator");

const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

const registerValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage("Email must be less than 100 characters"),

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Display name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("Display name must be between 2 and 30 characters")
        .matches(/^[a-zA-Z0-9\s\-_.]+$/)
        .withMessage(
            "Display name can only contain letters, numbers, spaces, hyphens, underscores, and dots"
        )
        .custom((value) => {
            // Remove excessive whitespace and check if still valid
            const cleaned = value.replace(/\s+/g, " ");
            if (cleaned !== value) {
                throw new Error(
                    "Display name cannot have multiple consecutive spaces"
                );
            }
            return true;
        }),

    body("password")
        .isLength({ min: 8, max: 128 })
        .withMessage("Password must be between 8 and 128 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .custom((value) => {
            // Check for common weak passwords
            const commonPasswords = [
                "password",
                "123456789",
                "qwerty",
                "abc123",
                "password123",
                "admin",
                "letmein",
                "welcome",
                "12345678",
            ];
            if (commonPasswords.includes(value.toLowerCase())) {
                throw new Error("Password is too common");
            }
            return true;
        }),
];

module.exports = { loginValidator, registerValidator };
