function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader != "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;

        next();
    } else {
        return res.status(403).body({
            success: false,
            message: "403 forbidden, JWT not set",
        });
    }
}

module.exports(verifyToken);
