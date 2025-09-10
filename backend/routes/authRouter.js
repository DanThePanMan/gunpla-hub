const { Router } = require("express");
const authController = require("../controllers/authController");
const {
    loginValidator,
    registerValidator,
} = require("../middleware/loginValidator");
const authRouter = Router();

authRouter.post("/token", loginValidator, authController.loginPost);

authRouter.post("/User", registerValidator, authController.userPost);

module.exports = authRouter;
