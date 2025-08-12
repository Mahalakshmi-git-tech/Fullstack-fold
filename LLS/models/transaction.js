// models/transaction.js

const mongoose = require('mongoose');

// Define the schema for transaction master
const transactionSchema = new mongoose.Schema({
  operation: {
    type: String, // Format: "OP01 - Cutting - A"
    required: true
  },
  item_code: {
    type: String, // Just the item code, e.g., "ITM001"
    required: true
  },
  quantity: {
    type: Number, // Total count of operations + items at the time of transaction
    required: true
  },
  date: {
    type: Date,
    default: Date.now // Automatically sets the current date/time
  }
});
transactionSchema.index({ operation: 1, item_code: 1 }, { unique: true });
// Export the model
module.exports = mongoose.model('Transaction', transactionSchema);
