require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
app.use(cors());
const httpServer = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "*"],
    // or with an array of origins ["http://localhost:3000", "https://freemiumarticles.web.app"]
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});
const mongoose = require("mongoose");
const inventoryRouter = require("./router/inventory");
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Middleware for parsing JSON request bodies
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`Server running on Port ${PORT}`);
});

// Set up routes for inventory management
// TODO: Define your RESTful API routes here
app.use("/inventory", inventoryRouter);

// Set up Socket.IO for real-time updates
io.on("connection", (socket) => {
  console.log("A client connected");

  // Handle events for real-time updates
  // TODO: Implement Socket.IO event handlers here

  // Handle events for real-time updates
  io.on("connection", (socket) => {
    console.log("A client connected");

    // Handle itemAdded event
    socket.on("itemAdded", (item) => {
      io.emit("itemAdded", item); // Broadcast the itemAdded event to all connected clients
    });

    // Handle itemUpdated event
    socket.on("itemUpdated", (item) => {
      io.emit("itemUpdated", item); // Broadcast the itemUpdated event to all connected clients
    });

    // Handle itemRemoved event
    socket.on("itemRemoved", (item) => {
      io.emit("itemRemoved", item); // Broadcast the itemRemoved event to all connected clients
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
