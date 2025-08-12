const express = require('express');
const router = express.Router();
const Operation = require('../models/operation'); // Adjust path if needed

// ✅ Add Operation
router.post('/add', async (req, res) => {
  try {
    const { operation_code, operation_name, operation_character } = req.body;

    if (!operation_code || !operation_name || !operation_character) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newOperation = new Operation({
      operation_code,
      operation_name,
      operation_character
    });

    await newOperation.save();
    res.status(201).json({ message: 'Operation added successfully', operation: newOperation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add operation', details: error.message });
  }
});

// ✅ Update Operation
router.put('/update', async (req, res) => {
  try {
    const { operation_code, operation_name, operation_character } = req.body;

    if (!operation_code || !operation_name || !operation_character) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const result = await Operation.updateOne(
      { operation_code },
      { $set: { operation_name, operation_character } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Operation not found' });
    }

    res.status(200).json({ message: 'Operation updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update operation', details: error.message });
  }
});

// ✅ Delete Operation
router.delete('/delete', async (req, res) => {
  try {
    const { operation_code } = req.body;

    if (!operation_code) {
      return res.status(400).json({ message: 'operation_code is required to delete' });
    }

    const result = await Operation.deleteOne({ operation_code });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Operation not found or already deleted' });
    }

    res.status(200).json({ message: 'Operation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete operation', details: error.message });
  }
});

// ✅ List All Operations
router.get('/list', async (req, res) => {
  try {
    const operations = await Operation.find();
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve operations', details: error.message });
  }
});

module.exports = router;
