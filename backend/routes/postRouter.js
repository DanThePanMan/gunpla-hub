const { Router } = require("express");
const postController = require("../controllers/postController");
const { postValidator } = require("../middleware/postValidator");
const verifyToken = require("../middleware/verifyToken");
const postRouter = Router();

// Get all posts (public)
postRouter.get("/", postController.postGet);

// Create a new post (protected - requires authentication)
postRouter.post("/", verifyToken, postValidator, postController.postPost);

// Get posts by specific user (public)
postRouter.get("/user/:userId", postController.getUserPosts);

module.exports = postRouter;
