const { Router } = require("express");
const postController = require("../controllers/postController");
const { postValidator } = require("../middleware/postValidator");
const verifyToken = require("../middleware/verifyToken");
const postRouter = Router();

// Get all posts (public) - for Explore page
postRouter.get("/", postController.postGet);

// Get feed posts (from followed users) - for Home page
postRouter.get("/feed", verifyToken, postController.getFeed);

// Create a new post (protected - requires authentication)
postRouter.post("/", verifyToken, postValidator, postController.postPost);

// Get posts by specific user (public)
postRouter.get("/user/:userId", postController.getUserPosts);

// get posts by postID
postRouter.get("/:postID", postController.postGetSingle);

// Update a post (protected)
postRouter.put("/:postID", verifyToken, postController.postUpdate);

// Delete a post (protected)
postRouter.delete("/:postID", verifyToken, postController.postDelete);

// Add comment to a post (protected)
postRouter.post("/:postID/comments", verifyToken, postController.commentPost);

// Like a post (protected)
postRouter.post("/:postID/like", verifyToken, postController.likePost);

// Unlike a post (protected)
postRouter.delete("/:postID/like", verifyToken, postController.unlikePost);

module.exports = postRouter;
