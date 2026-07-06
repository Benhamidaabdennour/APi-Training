const { activeTokens } = require("../routes/auth");

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            message: "Invalid Authorization header"
        });
    }

    const token = parts[1];

    if (!activeTokens.has(token)) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }

    next();
}

module.exports = authenticate;