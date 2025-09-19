const express = require("express");
const cors = require("cors");
const app = express();

// routers
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
