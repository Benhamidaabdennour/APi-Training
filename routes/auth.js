const express = require("express");
const { randomUUID } = require("crypto");

const router = express.Router();

// We'll keep active tokens in memory for now
const activeTokens = new Set();

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (
        email !== "admin@test.com" ||
        password !== "password123"
    ) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const token = randomUUID();

    activeTokens.add(token);

    res.json({
        accessToken: token,
        tokenType: "Bearer",
        expiresIn: 3600
    });
});

// Export both the router and the token store
module.exports = {
    router,
    activeTokens
};