const express = require("express");
const cors = require("cors");
const app = express();

// routers
const authRouter = require("./routes/authRouter");

const jwt = require("jsonwebtoken");

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173", // Frontend URL
        credentials: true,
    })
);
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
