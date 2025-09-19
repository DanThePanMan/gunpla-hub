const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader === "undefined") {
        return res.status(403).json({
            success: false,
            message: "403 Forbidden: No token provided",
        });
    }

    const bearer = bearerHeader.split(" ");
    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
        return res.status(403).json({
            success: false,
            message: "403 Forbidden: Invalid token format",
        });
    }

    const bearerToken = bearer[1];

    try {
        // Verify the JWT token
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);

        // Add the decoded user info to the request object
        req.user = decoded;
        req.token = bearerToken;

        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "403 Forbidden: Invalid or expired token",
        });
    }
}

module.exports = verifyToken;
