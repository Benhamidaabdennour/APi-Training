const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/users");
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
app.use("/users", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});