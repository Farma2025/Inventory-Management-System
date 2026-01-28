const Sales = require("../models/sales");
const Product = require("../models/product");
const Store = require("../models/store");

// Add Sales
const addSales = async (req, res) => {
  try {
    const { userId, productId, storeId, stockSold, saleAmount, saleDate } = req.body;

    console.log("📥 Received sale data:", req.body);

    // Validation
    if (!userId || !productId || !storeId || !stockSold || !saleAmount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: userId, productId, storeId, stockSold, saleAmount"
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Verify store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    // Create new sale
    const newSale = new Sales({
      userId,
      productId,
      storeId,
      stockSold: Number(stockSold),
      saleAmount: Number(saleAmount),
      saleDate: saleDate || new Date()
    });

    await newSale.save();

    console.log("✅ Sale created successfully:", newSale);

    res.status(201).json({
      success: true,
      message: "Sale added successfully",
      sale: newSale
    });

  } catch (error) {
    console.error("❌ Error adding sale:", error);
    res.status(500).json({
      success: false,
      message: "Error adding sale",
      error: error.message
    });
  }
};

// Get Sales Data
const getSalesData = async (req, res) => {
  try {
    const { userID } = req.params;

    console.log("🔍 Fetching sales for user:", userID);

    const sales = await Sales.find({ userId: userID })
      .populate("productId", "name")
      .populate("storeId", "name")
      .sort({ createdAt: -1 });

    console.log("📊 Found sales:", sales.length);

    res.status(200).json(sales);

  } catch (error) {
    console.error("❌ Error fetching sales:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sales",
      error: error.message
    });
  }
};

// Get Monthly Sales
const getMonthlySales = async (req, res) => {
  try {
    const { userID } = req.query;

    if (!userID) {
      return res.status(400).json({
        success: false,
        message: "userID is required"
      });
    }

    const monthlySales = await Sales.aggregate([
      { $match: { userId: userID } },
      {
        $group: {
          _id: {
            month: { $month: "$saleDate" },
            year: { $year: "$saleDate" }
          },
          totalSales: { $sum: "$saleAmount" },
          totalStock: { $sum: "$stockSold" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    console.log("📊 Monthly sales:", monthlySales);

    res.status(200).json(monthlySales);

  } catch (error) {
    console.error("❌ Error fetching monthly sales:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching monthly sales",
      error: error.message
    });
  }
};

// Get Total Sales Amount
const getTotalSalesAmount = async (req, res) => {
  try {
    const { userID } = req.params;

    const total = await Sales.aggregate([
      { $match: { userId: userID } },
      { $group: { _id: null, totalAmount: { $sum: "$saleAmount" } } }
    ]);

    const totalAmount = total.length > 0 ? total[0].totalAmount : 0;

    res.status(200).json({
      success: true,
      totalSalesAmount: totalAmount
    });

  } catch (error) {
    console.error("❌ Error calculating total sales:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating total sales",
      error: error.message
    });
  }
};

module.exports = { addSales, getSalesData, getMonthlySales, getTotalSalesAmount };