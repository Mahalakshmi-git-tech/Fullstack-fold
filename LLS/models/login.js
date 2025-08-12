const mongoose = require('mongoose');

// Define the schema for login
const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  user_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// Export the model
module.exports = mongoose.model('Login', loginSchema);
