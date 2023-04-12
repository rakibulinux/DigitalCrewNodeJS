const express = require("express");
const router = express.Router();
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
// Import the necessary models and modules
const Item = require("../models/item");
// Assuming you have a Mongoose model named 'Item' for inventory items

// GET /inventory - Retrieve the entire inventory
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve inventory" });
  }
});

// GET /inventory/:id - Retrieve a single item from the inventory
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve item" });
  }
});

// POST /inventory - Add a new item to the inventory
router.post("/", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    io.emit("itemAdded", savedItem); // Emit a Socket.IO event for real-time update
    res.json(savedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// PUT /inventory/:id - Update an existing item in the inventory
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedItem) {
      io.emit("itemUpdated", updatedItem); // Emit a Socket.IO event for real-time update
      res.json(updatedItem);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE /inventory/:id - Remove an item from the inventory
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndRemove(req.params.id);
    if (deletedItem) {
      io.emit("itemRemoved", deletedItem); // Emit a Socket.IO event for real-time update
      res.json(deletedItem);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item" });
  }
});

module.exports = router;
