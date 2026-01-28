const Store = require("../models/store");

// Add Store
const addStore = async (req, res) => {
  console.log("📝 Adding new store:", req.body);
  
  try {
    const addStore = new Store({
      userID: req.body.userId,
      name: req.body.name,
      category: req.body.category,
      address: req.body.address,
      city: req.body.city,
      image: req.body.image
    });

    const result = await addStore.save();
    console.log("✅ Store added successfully:", result);
    res.status(200).send(result);
  } catch (err) {
    console.error("❌ Error adding store:", err);
    res.status(402).send(err);
  }
};

// Get All Stores
const getAllStores = async (req, res) => {
  console.log("🔍 GET Stores Request Received");
  console.log("🔍 Requested UserID:", req.params.userID);
  
  try {
    const findAllStores = await Store.find({ userID: req.params.userID }).sort({ _id: -1 });
    
    console.log("🔍 Stores Found:", findAllStores);
    console.log("🔍 Number of Stores:", findAllStores.length);
    
    res.status(200).json(findAllStores);
  } catch (err) {
    console.error("❌ Error fetching stores:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addStore, getAllStores };