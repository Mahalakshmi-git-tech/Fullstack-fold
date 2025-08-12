const express = require('express');
const router = express.Router();
const Item = require('../models/item'); // Ensure path is correct

// Add Item Route
router.post('/add', async (req, res) => {
  try {
    const { item_code, item_name } = req.body;

    // Check for missing fields
    if (!item_code || !item_name) {
      return res.status(400).json({ success: false, message: "Item Code and Item Name are required." });
    }

    // Optional: check for duplicates
    const existing = await Item.findOne({ item_code });
    if (existing) {
      return res.status(409).json({ success: false, message: "Item Code already exists." });
    }

    // Save the new item
    const newItem = new Item({ item_code, item_name });
    await newItem.save();

    res.status(201).json({ success: true, message: "Item added successfully." });

  } catch (error) {
    console.error("❌ Error in /item/add:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});
router.get('/list', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items' });
  }
});
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item not found.' });
    res.json({ message: 'Item deleted successfully.' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Delete failed.' });
  }
});
module.exports = router;
