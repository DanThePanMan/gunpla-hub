const jwt = require("jsonwebtoken");

// Optional token verification - doesn't require a token but will decode it if present
function optionalVerifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader === "undefined") {
        // No token provided, but that's okay - continue without user info
        req.user = null;
        return next();
    }

    const bearer = bearerHeader.split(" ");
    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
        // Invalid format, but continue without user info
        req.user = null;
        return next();
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
        // Invalid token, but continue without user info
        req.user = null;
        next();
    }
}

module.exports = optionalVerifyToken;
