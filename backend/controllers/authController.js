async function loginPost(req, res) {
    try {
        const creds = req.body;
        console.log("Login attempt:", creds);

        // TODO: Add actual authentication logic here
        if (!creds.email || !creds.password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        res.json({
            success: true,
            message: "test message",
            // below is the jwt login res i think
            user: {
                id: 1,
                email: creds.email,
                name: "Test User",
            },
            token: "mock-jwt-token", // Replace with actual JWT token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
async function userPost(req, res) {}

module.exports = {
    loginPost,
    userPost,
};
