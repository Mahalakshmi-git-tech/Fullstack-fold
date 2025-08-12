// routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  item_code: String,
  item_name: String,
  operation_code: String,
  operation_name: String,
  operation_character: String,
  quantity:Number,
  date: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// Add a new transaction
router.post("/add", async (req, res) => {
  try {
    const {
      item_code,
      item_name,
      operation_code,
      operation_name,
      operation_character,
      quantity // ✅ Get quantity from the request body
    } = req.body;

    if (!quantity || isNaN(quantity)) {
      return res.status(400).json({ message: "Invalid or missing quantity" });
    }

    const newTransaction = new Transaction({
      item_code,
      item_name,
      operation_code,
      operation_name,
      operation_character,
      quantity: parseInt(quantity), // ✅ Save quantity given by user
      date: new Date() // ✅ Save the current date and time
    });

    await newTransaction.save();

    res.json({ message: "Transaction added successfully" });
  } catch (error) {
    console.error("Add error:", error);
    res.status(500).json({ message: "Failed to add transaction" });
  }
});

// Get all transactions
router.get("/list", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error("List error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

// Update transaction
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Transaction updated", updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update transaction" });
  }
});

// Delete transaction
router.delete("/delete/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

module.exports = router;
