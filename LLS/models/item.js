// models/item.js

const mongoose = require('mongoose');

// Define the schema for item master
const itemSchema = new mongoose.Schema({
  item_code: {
    type: String,
    required: true,
    unique: true
  },
  item_name: {
    type: String,
    required: true
  }
});

// Export the model
// This will create a collection named 'item_masters' in MongoDB
module.exports = mongoose.model('Item', itemSchema);
