// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON requests
app.use(bodyParser.urlencoded({ extended: true }));


// ✅ Serve static files like login.html
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Masters', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB');
});


// ✅ Routes
const itemRoutes = require('./routes/itemRoutes');
const operationRoutes = require('./routes/operationRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const loginRoutes = require('./routes/loginRoutes'); // for loginDetails collection


app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/operations', require('./routes/operationRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/auth', loginRoutes); // handles login + signup

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
