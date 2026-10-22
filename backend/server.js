const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongodb:27017/three_tier_app";

app.use(cors());
app.use(express.json());

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }
});

const Product = mongoose.model("Product", productSchema);

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", service: "backend" });
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    if (await Product.countDocuments() === 0) {
      await Product.insertMany([
        { name: "Laptop", price: 45000, category: "Electronics" },
        { name: "Headphones", price: 1500, category: "Accessories" },
        { name: "Keyboard", price: 1200, category: "Accessories" }
      ]);
      console.log("Sample products inserted");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
