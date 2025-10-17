const express = require("express");
const jwt = require("jsonwebtoken");
const Expense = require("../../models/Expense");

const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
}

router.post("/", auth, async (req, res) => {
  const { category, amount, comments } = req.body;
  const expense = new Expense({
    userId: req.userId,
    category,
    amount,
    comments,
  });
  await expense.save();
  res.json(expense);
});

router.get("/", auth, async (req, res) => {
  const expenses = await Expense.find({ userId: req.userId }).sort({
    createdAt: -1,
  });
  res.json(expenses);
});

router.put("/:id", auth, async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(expense);
});

router.delete("/:id", auth, async (req, res) => {
  await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
