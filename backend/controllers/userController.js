const { prisma } = require("../utils/prismaClient");

// Get user profile with follow stats
async function getUserProfile(req, res) {
    try {
        const { userId } = req.params;
        const currentUserId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const id = parseInt(userId, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const user = await prisma.user.findUnique({
            where: { userId: id },
            select: {
                userId: true,
                displayName: true,
                email: true,
                profilePicture: true,
                createdAt: true,
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                        following: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if current user is following this user
        let isFollowing = false;
        if (currentUserId && currentUserId !== id) {
            const followRecord = await prisma.follows.findUnique({
                where: {
                    followerId_followedId: {
                        followerId: currentUserId,
                        followedId: id,
                    },
                },
            });
            isFollowing = !!followRecord;
        }

        res.json({
            success: true,
            user: {
                ...user,
                isFollowing,
                isOwnProfile: currentUserId === id,
            },
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user profile",
        });
    }
}

// Follow a user
async function followUser(req, res) {
    try {
        const { userId } = req.params;
        const followerId = req.user.id;

        const id = parseInt(userId, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        if (followerId === id) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself",
            });
        }

        // Check if user exists
        const userToFollow = await prisma.user.findUnique({
            where: { userId: id },
        });

        if (!userToFollow) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if already following
        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followedId: {
                    followerId: followerId,
                    followedId: id,
                },
            },
        });

        if (existingFollow) {
            return res.status(400).json({
                success: false,
                message: "Already following this user",
            });
        }

        await prisma.follows.create({
            data: {
                followerId: followerId,
                followedId: id,
            },
        });

        res.status(201).json({
            success: true,
            message: "Successfully followed user",
        });
    } catch (error) {
        console.error("Error following user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to follow user",
        });
    }
}

// Unfollow a user
async function unfollowUser(req, res) {
    try {
        const { userId } = req.params;
        const followerId = req.user.id;

        const id = parseInt(userId, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followedId: {
                    followerId: followerId,
                    followedId: id,
                },
            },
        });

        if (!existingFollow) {
            return res.status(400).json({
                success: false,
                message: "Not following this user",
            });
        }

        await prisma.follows.delete({
            where: {
                followerId_followedId: {
                    followerId: followerId,
                    followedId: id,
                },
            },
        });

        res.json({
            success: true,
            message: "Successfully unfollowed user",
        });
    } catch (error) {
        console.error("Error unfollowing user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to unfollow user",
        });
    }
}

// Get users the current user is following
async function getFollowing(req, res) {
    try {
        const { userId } = req.params;

        const id = parseInt(userId, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const following = await prisma.follows.findMany({
            where: { followerId: id },
            include: {
                followedUser: {
                    select: {
                        userId: true,
                        displayName: true,
                        email: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            following: following.map((f) => f.followedUser),
        });
    } catch (error) {
        console.error("Error fetching following:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch following",
        });
    }
}

// Get users following the current user
async function getFollowers(req, res) {
    try {
        const { userId } = req.params;

        const id = parseInt(userId, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const followers = await prisma.follows.findMany({
            where: { followedId: id },
            include: {
                followerUser: {
                    select: {
                        userId: true,
                        displayName: true,
                        email: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            followers: followers.map((f) => f.followerUser),
        });
    } catch (error) {
        console.error("Error fetching followers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch followers",
        });
    }
}

// Get all users for community page
async function getAllUsers(req, res) {
    try {
        const currentUserId = req.user?.id;

        const users = await prisma.user.findMany({
            select: {
                userId: true,
                displayName: true,
                email: true,
                createdAt: true,
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                        following: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // If logged in, check which users the current user is following
        let usersWithFollowStatus = users;
        if (currentUserId) {
            const following = await prisma.follows.findMany({
                where: { followerId: currentUserId },
                select: { followedId: true },
            });
            const followingIds = new Set(following.map((f) => f.followedId));

            usersWithFollowStatus = users.map((user) => ({
                ...user,
                isFollowing: followingIds.has(user.userId),
                isOwnProfile: user.userId === currentUserId,
            }));
        }

        res.json({
            success: true,
            users: usersWithFollowStatus,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
}

// Update user profile
async function updateProfile(req, res) {
    try {
        const userId = req.user.id;
        const { displayName, profilePicture } = req.body;

        const updateData = {};
        
        if (displayName && displayName.trim()) {
            updateData.displayName = displayName.trim();
        }
        
        if (profilePicture !== undefined) {
            updateData.profilePicture = profilePicture || null;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update",
            });
        }

        const updatedUser = await prisma.user.update({
            where: { userId },
            data: updateData,
            select: {
                userId: true,
                displayName: true,
                email: true,
                profilePicture: true,
            },
        });

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
}

module.exports = {
    getUserProfile,
    followUser,
    unfollowUser,
    getFollowing,
    getFollowers,
    getAllUsers,
    updateProfile,
};
