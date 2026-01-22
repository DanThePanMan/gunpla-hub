const { Router } = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const optionalVerifyToken = require("../middleware/optionalVerifyToken");
const userRouter = Router();

// Get all users for community page (optionally authenticated for follow status)
userRouter.get("/", optionalVerifyToken, userController.getAllUsers);

// Update own profile - must be before /:userId to avoid conflict
userRouter.put("/profile", verifyToken, userController.updateProfile);

// Get user profile (optionally authenticated for follow status)
userRouter.get("/:userId", optionalVerifyToken, userController.getUserProfile);

// Follow a user
userRouter.post("/:userId/follow", verifyToken, userController.followUser);

// Unfollow a user
userRouter.delete("/:userId/follow", verifyToken, userController.unfollowUser);

// Get users a user is following
userRouter.get("/:userId/following", userController.getFollowing);

// Get users following a user
userRouter.get("/:userId/followers", userController.getFollowers);

module.exports = userRouter;
