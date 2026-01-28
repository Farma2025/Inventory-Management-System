const Purchase = require("../models/purchase");
const purchaseStock = require("./purchaseStock");

// Add Purchase Details
const addPurchase = (req, res) => {
  console.log("Received purchase data:", req.body); // ✅ Add this line
  
  const addPurchaseDetails = new Purchase({
    userID: req.body.userID,
    ProductID: req.body.ProductID,
    QuantityPurchased: req.body.QuantityPurchased,
    PurchaseDate: req.body.PurchaseDate,
    TotalPurchaseAmount: req.body.TotalPurchaseAmount,
  });

  console.log("Creating purchase:", addPurchaseDetails); // ✅ Add this line

  addPurchaseDetails
    .save()
    .then((result) => {
      console.log("Purchase saved successfully:", result); // ✅ Add this line
      purchaseStock(req.body.ProductID, req.body.QuantityPurchased);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error("Error saving purchase:", err); // ✅ Add this line
      res.status(402).send(err);
    });
};

// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  const findAllPurchaseData = await Purchase.find({"userID": req.params.userID})
    .sort({ _id: -1 })
    .populate("ProductID");
  res.json(findAllPurchaseData);
};

// Get total purchase amount
const getTotalPurchaseAmount = async (req, res) => {
  let totalPurchaseAmount = 0;
  const purchaseData = await Purchase.find({"userID": req.params.userID});
  purchaseData.forEach((purchase) => {
    totalPurchaseAmount += purchase.TotalPurchaseAmount;
  });
  res.json({ totalPurchaseAmount });
};

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount };