const { prisma } = require("../utils/prismaClient");
const { validationResult } = require("express-validator");

// Get all posts
async function postGet(req, res) {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        userId: true,
                        displayName: true,
                        email: true,
                    },
                },
                build: true,
                likedBy: {
                    include: {
                        likedUser: {
                            select: {
                                userId: true,
                                displayName: true,
                            },
                        },
                    },
                },
                comments: {
                    include: {
                        commenterUser: {
                            select: {
                                userId: true,
                                displayName: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        likedBy: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json({
            success: true,
            posts: posts,
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
        });
    }
}

// Create a new post
async function postPost(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { title, content, build } = req.body;

        // Get the authenticated user's ID from the JWT token
        const authorId = req.user.id;

        // Create post with optional build data
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                authorId: parseInt(authorId),
                build: build
                    ? {
                          create: {
                              kitName: build.kitName,
                              grade: build.grade,
                              difficulty: build.difficulty || null,
                              customizations: build.customizations || null,
                          },
                      }
                    : undefined,
            },
            include: {
                author: {
                    select: {
                        userId: true,
                        displayName: true,
                        email: true,
                    },
                },
                build: true,
                likedBy: true,
                comments: true,
            },
        });

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: newPost,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create post",
        });
    }
}

// Get posts by specific user
async function getUserPosts(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const posts = await prisma.post.findMany({
            where: {
                authorId: parseInt(userId),
            },
            include: {
                author: {
                    select: {
                        userId: true,
                        displayName: true,
                        email: true,
                    },
                },
                build: true,
                likedBy: {
                    include: {
                        likedUser: {
                            select: {
                                userId: true,
                                displayName: true,
                            },
                        },
                    },
                },
                comments: {
                    include: {
                        commenterUser: {
                            select: {
                                userId: true,
                                displayName: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        likedBy: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                userId: parseInt(userId),
            },
            select: {
                userId: true,
                displayName: true,
                email: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            user: user,
            posts: posts,
            totalPosts: posts.length,
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user posts",
        });
    }
}

module.exports = {
    postGet,
    postPost,
    getUserPosts,
};
