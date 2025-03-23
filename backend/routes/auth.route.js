import express from "express";

const router = express.Router();

router.get("/login", (req, res) => {
    res.json({ message: "You are logged in" });
});

export default router;
