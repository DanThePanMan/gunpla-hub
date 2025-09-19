const { body } = require("express-validator");

const postValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3, max: 200 })
        .withMessage("Title must be between 3 and 200 characters"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ min: 10, max: 5000 })
        .withMessage("Content must be between 10 and 5000 characters"),

    // Note: authorId is now extracted from JWT token, not from request body

    // Optional build validation
    body("build.kitName")
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Kit name must be between 1 and 200 characters"),

    body("build.grade")
        .optional()
        .trim()
        .isIn([
            "High Grade",
            "Real Grade",
            "Master Grade",
            "Perfect Grade",
            "Mega Size",
        ])
        .withMessage(
            "Grade must be one of: High Grade, Real Grade, Master Grade, Perfect Grade, Mega Size"
        ),

    body("build.difficulty")
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage("Difficulty must be between 1 and 10"),

    body("build.customizations")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Customizations must be less than 1000 characters"),
];

module.exports = {
    postValidator,
};
