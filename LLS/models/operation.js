const mongoose = require('mongoose');

// Define the schema for operation master
const operationSchema = new mongoose.Schema({
  operation_code: {
    type: String,
    required: true,
    unique: true
  },
  operation_name: {
    type: String,
    required: true
  },
  operation_character: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Operation', operationSchema);

