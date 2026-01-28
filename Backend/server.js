const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 4000; // CHANGED: Fixed to port 4000

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3003", "http://localhost:3004"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "your-mongodb-connection-string";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Successfully connected to MongoDB");
})
.catch((error) => {
  console.error("MongoDB connection error:", error);
});

// ===== SCHEMAS =====

// User Schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    default: ""
  },
  imageUrl: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", UserSchema);

// Store Schema
const StoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const Store = mongoose.model("Store", StoreSchema);

// Product Schema
const ProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    default: ""
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    default: ""
  },
  availability: {
    type: String,
    enum: ["In Stock", "Out of Stock"],
    default: "In Stock"
  },
  image: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", ProductSchema);

// Purchase Schema
const PurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product"
  },
  quantityPurchased: {
    type: Number,
    required: true
  },
  totalPurchaseAmount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Purchase = mongoose.model("Purchase", PurchaseSchema);

// Sales Schema
const SalesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product"
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store"
  },
  stockSold: {
    type: Number,
    required: true
  },
  saleAmount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Sales = mongoose.model("Sales", SalesSchema);

// ===== AUTHENTICATION ROUTES =====

// POST - Register a new user
app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, imageUrl } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        message: "Missing required fields" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists" 
      });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber: phoneNumber || "",
      imageUrl: imageUrl || ""
    });

    const savedUser = await newUser.save();
    
    res.status(201).json({
      _id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      phoneNumber: savedUser.phoneNumber,
      imageUrl: savedUser.imageUrl,
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
});

// POST - Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password required" 
      });
    }

    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }
    
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      imageUrl: user.imageUrl
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
});

// ===== STORE ROUTES =====

// GET - Fetch all stores
app.get("/api/store/get/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const stores = await Store.find({ userId });
    res.status(200).json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST - Create store
app.post("/api/store/add", async (req, res) => {
  try {
    const { userId, name, category, address, city, image } = req.body;
    
    if (!userId || !name || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newStore = new Store({
      userId, name, category: category || "", address, city: city || "", image: image || ""
    });

    const savedStore = await newStore.save();
    res.status(201).json({ message: "Store created", store: savedStore });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ===== PRODUCT ROUTES =====

// GET - Fetch all products
app.get("/api/product/get/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const products = await Product.find({ userId });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST - Create product
app.post("/api/product/add", async (req, res) => {
  try {
    const { userId, name, manufacturer, stock, description, availability, image } = req.body;
    
    if (!userId || !name) {
      return res.status(400).json({ message: "userId and name are required" });
    }

    const newProduct = new Product({
      userId,
      name,
      manufacturer: manufacturer || "",
      stock: stock || 0,
      description: description || "",
      availability: availability || "In Stock",
      image: image || ""
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT - Update product
app.put("/api/product/update/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE - Delete product
app.delete("/api/product/delete/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ===== PURCHASE ROUTES =====

// GET - Fetch purchases
app.get("/api/purchase/get/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const purchases = await Purchase.find({ userId }).populate('productId');
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST - Add purchase
app.post("/api/purchase/add", async (req, res) => {
  try {
    const { userId, productId, quantityPurchased, totalPurchaseAmount } = req.body;
    
    if (!userId || !productId || !quantityPurchased || !totalPurchaseAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPurchase = new Purchase({
      userId,
      productId,
      quantityPurchased,
      totalPurchaseAmount
    });

    const savedPurchase = await newPurchase.save();
    
    // Update product stock
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: quantityPurchased } }
    );
    
    res.status(201).json({ message: "Purchase added successfully", purchase: savedPurchase });
  } catch (error) {
    console.error("Error adding purchase:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET - Total purchase amount
app.get("/api/purchase/get/:userId/totalpurchaseamount", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Purchase.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$totalPurchaseAmount" } } }
    ]);
    res.status(200).json({ totalPurchaseAmount: result[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ===== SALES ROUTES =====

// GET - Fetch all sales for a user
app.get("/api/sales/get/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const sales = await Sales.find({ userId })
      .sort({ createdAt: -1 })
      .populate('productId')
      .populate('storeId');
    
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST - Add a new sale
app.post("/api/sales/add", async (req, res) => {
  try {
    const { userId, productId, storeId, stockSold, saleAmount } = req.body;
    
    if (!userId || !productId || !stockSold || !saleAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newSale = new Sales({
      userId,
      productId,
      storeId,
      stockSold,
      saleAmount
    });

    const savedSale = await newSale.save();
    
    // Update product stock
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -stockSold } }
    );
    
    res.status(201).json({ message: "Sale added successfully", sale: savedSale });
  } catch (error) {
    console.error("Error adding sale:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET - Total sale amount
app.get("/api/sales/get/:userId/totalsaleamount", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Sales.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$saleAmount" } } }
    ]);
    res.status(200).json({ totalSaleAmount: result[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET - Monthly sales
app.get("/api/sales/getmonthly", async (req, res) => {
  try {
    const monthlySales = await Sales.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$saleAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json(monthlySales);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK",
    message: "Server running on port 4000"
  });
});

// Start server
app.listen(PORT, () => {
  console.log("=================================");
  console.log(`✅ Server running on port ${PORT}`);
  console.log("=================================");
});

module.exports = app;