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

// POST /users
router.post("/", async (req, res) => {

    const users = await fs.readJson(filePath);

    const { firstName, lastName, email, department } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !department) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Check duplicate email
    const existingUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        return res.status(409).json({
            message: "Email already exists"
        });
    }

    // Generate next ID
    const nextId =
        users.length > 0
            ? Math.max(...users.map(u => u.id)) + 1
            : 1;

    const newUser = {
        id: nextId,
        firstName,
        lastName,
        email,
        department
    };

    users.push(newUser);

    await fs.writeJson(filePath, users, { spaces: 2 });

    res.status(201).json(newUser);
});

// PATCH /users/:id
router.patch("/:id", async (req, res) => {

    const users = await fs.readJson(filePath);

    const id = Number(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    Object.assign(user, req.body);

    await fs.writeJson(filePath, users, {
        spaces: 2
    });

    res.json(user);

});

// PUT /users/:id
router.put("/:id", async (req, res) => {

    const users = await fs.readJson(filePath);

    const id = Number(req.params.id);

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const {
        firstName,
        lastName,
        email,
        department
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !department) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Prevent duplicate emails
    const duplicate = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.id !== id
    );

    if (duplicate) {
        return res.status(409).json({
            message: "Email already exists"
        });
    }

    const updatedUser = {
        id,
        firstName,
        lastName,
        email,
        department
    };

    users[userIndex] = updatedUser;

    await fs.writeJson(filePath, users, {
        spaces: 2
    });

    res.json(updatedUser);

});
module.exports = router;