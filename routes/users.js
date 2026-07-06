const express = require("express");
const fs = require("fs-extra");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "../data/users.json");

// GET /users
router.get("/", async (req, res) => {
    const users = await fs.readJson(filePath);
    res.json(users);
});

// GET /users/:id
router.get("/:id", async (req, res) => {
    const users = await fs.readJson(filePath);

    const id = Number(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
});

module.exports = router;