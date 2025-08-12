// routes/loginRoutes.js
const express = require('express');
const router = express.Router();
const Login = require('../models/login'); // path to your login model

router.post('/', async (req, res) => {
  const { username, user_id, password, mode } = req.body;

  if (!username || !user_id || !password || !mode) {
    return res.json({ success: false, message: 'All fields are required' });
  }

  try {
    if (mode === 'signup') {
      const existingUser = await Login.findOne({ user_id });

      if (existingUser) {
        return res.json({ success: false, message: 'User ID already exists' });
      }

      const newUser = new Login({ username, user_id, password });
      await newUser.save();
      return res.json({ success: true, message: 'User registered successfully' });

    } else if (mode === 'login') {
      const user = await Login.findOne({ username, user_id, password });

      if (user) {
        return res.json({ success: true, message: 'Login successful' });
      } else {
        return res.json({ success: false, message: 'Invalid credentials' });
      }
    }

    res.json({ success: false, message: 'Invalid mode' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
