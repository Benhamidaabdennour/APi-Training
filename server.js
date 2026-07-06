const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/users");
const { router: authRouter } = require("./routes/auth");
const authenticate = require("./middleware/auth");
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.get("/", (req, res) => {
    res.json({
        message: "API Training is running 🚀"
    });
});
app.use("/auth", authRouter);
app.use("/users", authenticate, usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
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