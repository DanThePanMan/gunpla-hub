const { prisma } = require("../utils/prismaClient");
const { validationResult } = require("express-validator");

// Get feed posts (posts from users the current user follows)
async function getFeed(req, res) {
    try {
        const userId = req.user.id;

        // Get users that the current user follows
        const following = await prisma.follows.findMany({
            where: { followerId: userId },
            select: { followedId: true },
        });

        const followedUserIds = following.map((f) => f.followedId);

        // If not following anyone, return empty feed
        if (followedUserIds.length === 0) {
            return res.json({
                success: true,
                posts: [],
                message: "Follow some users to see their posts in your feed!",
            });
        }

        const posts = await prisma.post.findMany({
            where: {
                authorId: { in: followedUserIds },
            },
            include: {
                author: {
                    select: {
                        userId: true,
                        displayName: true,
                        email: true,
                        profilePicture: true,
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
        console.error("Error fetching feed:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch feed",
        });
    }
}

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

//get single post
async function postGetSingle(req, res) {
    try {
        const { postID } = req.params;

        if (!postID) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }

        const id = parseInt(postID, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        const post = await prisma.post.findUnique({
            where: { id },
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
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        res.json({
            success: true,
            post,
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user posts",
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

        const { title, content, pictures, build } = req.body;

        // Get the authenticated user's ID from the JWT token
        const authorId = req.user.id;

        // Create post with optional build data
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                pictures,
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

// Update a post
async function postUpdate(req, res) {
    try {
        const { postID } = req.params;
        const userId = req.user.id;

        if (!postID) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }

        const id = parseInt(postID, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        // Check if post exists and user is author
        const existingPost = await prisma.post.findUnique({
            where: { id },
        });

        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (existingPost.authorId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own posts",
            });
        }

        const { title, content, pictures, build } = req.body;

        // Update post
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title: title || existingPost.title,
                content: content || existingPost.content,
                pictures: pictures || existingPost.pictures,
                build: build
                    ? {
                          upsert: {
                              create: {
                                  kitName: build.kitName,
                                  grade: build.grade,
                                  difficulty: build.difficulty || null,
                                  customizations: build.customizations || null,
                              },
                              update: {
                                  kitName: build.kitName,
                                  grade: build.grade,
                                  difficulty: build.difficulty || null,
                                  customizations: build.customizations || null,
                              },
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
            },
        });

        res.json({
            success: true,
            message: "Post updated successfully",
            post: updatedPost,
        });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update post",
        });
    }
}

// Delete a post
async function postDelete(req, res) {
    try {
        const { postID } = req.params;
        const userId = req.user.id;

        if (!postID) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }

        const id = parseInt(postID, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        // Check if post exists and user is author
        const existingPost = await prisma.post.findUnique({
            where: { id },
        });

        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (existingPost.authorId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own posts",
            });
        }

        // Delete related data first (comments, likes, build)
        await prisma.comment.deleteMany({ where: { postId: id } });
        await prisma.likes.deleteMany({ where: { postId: id } });
        await prisma.build.deleteMany({ where: { postId: id } });

        // Delete post
        await prisma.post.delete({ where: { id } });

        res.json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete post",
        });
    }
}

// Add a comment to a post
async function commentPost(req, res) {
    try {
        const { postID } = req.params;
        const userId = req.user.id;
        const { content } = req.body;

        if (!postID) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required",
            });
        }

        const id = parseInt(postID, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                commenterId: userId,
                postId: id,
            },
            include: {
                commenterUser: {
                    select: {
                        userId: true,
                        displayName: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment,
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add comment",
        });
    }
}

// Like a post
async function likePost(req, res) {
    try {
        const { postID } = req.params;
        const userId = req.user.id;

        const id = parseInt(postID, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // Check if already liked
        const existingLike = await prisma.likes.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: id,
                },
            },
        });

        if (existingLike) {
            return res.status(400).json({
                success: false,
                message: "Already liked this post",
            });
        }

        const like = await prisma.likes.create({
            data: {
                userId: userId,
                postId: id,
            },
        });

        res.status(201).json({
            success: true,
            message: "Post liked",
            like,
        });
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to like post",
        });
    }
}

// Unlike a post
async function unlikePost(req, res) {
    try {
        const { postID } = req.params;
        const userId = req.user.id;

        const id = parseInt(postID, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        const existingLike = await prisma.likes.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: id,
                },
            },
        });

        if (!existingLike) {
            return res.status(400).json({
                success: false,
                message: "Not liked yet",
            });
        }

        await prisma.likes.delete({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: id,
                },
            },
        });

        res.json({
            success: true,
            message: "Post unliked",
        });
    } catch (error) {
        console.error("Error unliking post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to unlike post",
        });
    }
}

module.exports = {
    getFeed,
    postGet,
    postPost,
    getUserPosts,
    postGetSingle,
    postUpdate,
    postDelete,
    commentPost,
    likePost,
    unlikePost,
};
