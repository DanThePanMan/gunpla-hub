const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { prisma } = require("../utils/prismaClient");
const { validationResult } = require("express-validator");

async function loginPost(req, res) {
    // all the logic to sanitize, normalize and verify result
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        const creds = req.body;
        const normalizedEmail = creds.email.trim().toLowerCase();

        // find user in db
        const user = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Verify creds
        const isPasswordValid = await bcrypt.compare(
            creds.password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // all the jwt nonsence
        if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
        const JWT_SECRET = process.env.JWT_SECRET;

        const token = jwt.sign(
            { id: user.userId, email: user.email },
            JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.userId,
                displayName: user.displayName,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
async function userPost(req, res) {
    // Expected request body format:
    // {
    //   "username": "string (required) - user's display name",
    //   "email": "string (required) - user's email address",
    //   "password": "string (required) - user's password"
    // }
    try {
        // all the sanitization normalization and such
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        const creds = req.body;
        const normalizedEmail = creds.email;
        const sanitizedUsername = creds.username;

        if (!normalizedEmail || !creds.password || !sanitizedUsername) {
            return res.status(400).json({
                success: false,
                message: "Bad request - missing required fields",
            });
        }

        // bcrypt the password and post user
        const hashedPassword = await bcrypt.hash(creds.password, 10);
        const user = await prisma.user.create({
            data: {
                displayName: sanitizedUsername,
                email: normalizedEmail,
                password: hashedPassword,
            },
            select: {
                userId: true,
                email: true,
                displayName: true,
                createdAt: true,
            },
        });

        // all the jwt nonsence
        if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
        const JWT_SECRET = process.env.JWT_SECRET;

        const token = jwt.sign(
            { id: user.userId, email: user.email },
            JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        return res.status(201).json({
            success: true,
            message: "Sign-up successful",
            user: {
                id: user.userId,
                displayName: user.displayName,
                email: user.email,
            },
            token: token,
        });
    } catch (error) {
        // if user already exists
        if (error.code === "P2002") {
            return res.status(400).json({
                success: false,
                message: "Email already in use",
            });
        }

        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = {
    loginPost,
    userPost,
};
