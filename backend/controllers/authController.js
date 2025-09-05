const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { prisma } = require("../utils/prismaClient");
const { validationResult } = require("express-validator");
async function loginPost(req, res) {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const creds = req.body;

        // Normalize email input
        const normalizedEmail = creds.email.trim().toLowerCase();

        // Find user with normalized email
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

        // Verify password
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
        if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
        const JWT_SECRET = process.env.JWT_SECRET;

        const token = jwt.sign(
            { id: user.userId, email: user.email },
            JWT_SECRET,
            {
                expiresIn: "24h", // Extended for better UX
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
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
    try {
        const creds = req.body;

        // Normalize email input
        const normalizedEmail = creds.email.trim().toLowerCase();

        // Sanitize display name
        const sanitizedUsername = creds.username.trim();

        // the request only sends user and password, the confirm password section is done clinet side
        if (!normalizedEmail || !creds.password || !sanitizedUsername) {
            console.error("error: bad request, did not provide full login");
            return res.status(400).json({
                success: false,
                message: "Bad request",
            });
        }
        const hashedPassword = await bcrypt.hash(creds.password, 10);
        const user = await prisma.user.create({
            data: {
                displayName: sanitizedUsername,
                email: normalizedEmail,
                password: hashedPassword,
            },
            select: {
                userId: true, // Fixed: use userId instead of id
                email: true,
                displayName: true,
                createdAt: true,
            },
        });

        // Generate JWT token for immediate login after registration
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
            user: user,
            token: token, // Now returns actual JWT token
        });
    } catch (error) {
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
