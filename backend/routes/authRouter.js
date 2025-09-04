const { Router } = require("express");
const authController = require("../controllers/authController");

const authRouter = Router();

authRouter.post("/login", authController.loginPost);

authRouter.post("/User", authController.userPost);

module.exports = authRouter;
