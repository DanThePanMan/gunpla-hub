const { Router } = require("express");
const authController = require("../controllers/authController");
const { loginValidator } = require("../middleware/loginValidator");
const authRouter = Router();

authRouter.post("/login", loginValidator, authController.loginPost);

authRouter.post("/User", authController.userPost);

module.exports = authRouter;
