import React, { useState, useEffect, useContext } from "react";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);
  
  // 🔍 DEBUG: Log user ID
  console.log("🔍 Current User ID:", authContext.user);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage]);

  // Fetching Data of All Sales
  const fetchSalesData = () => {
    console.log("🔍 Fetching sales for user:", authContext.user);
    fetch(`http://localhost:4000/api/sales/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("📦 Raw sales response:", data);
        console.log("📊 Number of sales:", data.length);
        
        if (data.length > 0) {
          console.log("🎯 First sale:", data[0]);
          console.log("🏷️ productId object:", data[0].productId);
          console.log("🏪 storeId object:", data[0].storeId);
        }
        
        setAllSalesData(data);
      })
      .catch((err) => console.log("❌ Error fetching sales:", err));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    console.log("🔍 Fetching products for user:", authContext.user);
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("🔍 PRODUCTS RECEIVED:", data);
        console.log("🔍 Number of products:", data.length);
        setAllProducts(data);
      })
      .catch((err) => console.log("❌ Error fetching products:", err));
  };

  // Fetching Data of All Stores
  const fetchStoresData = () => {
    console.log("🔍 Fetching stores for user:", authContext.user);
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("🔍 STORES RECEIVED:", data);
        console.log("🔍 Number of stores:", data.length);
        setAllStores(data);
      })
      .catch((err) => console.log("❌ Error fetching stores:", err));
  };

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Sales</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addSaleModalSetting}
              >
                Add Sales
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Product Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Store Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Stock Sold
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Sales Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total Sale Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {sales.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.productId?.name || "Unknown Product"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.storeId?.name || "Unknown Store"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stockSold}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {new Date(element.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      ₹{element.saleAmount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;