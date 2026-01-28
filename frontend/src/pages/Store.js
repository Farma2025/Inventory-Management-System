import React, { useState, useEffect, useContext } from "react";
import AddStore from "../components/AddStore";
import AuthContext from "../AuthContext";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetching all stores data
  const fetchData = () => {
    setLoading(true);
    setError(null);
    
    // Check if user is authenticated
    if (!authContext.user) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    console.log("Fetching stores for user:", authContext.user); // Debug log
    
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => {
        console.log("Response status:", response.status); // Debug log
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched stores:", data); // Debug log
        setAllStores(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stores:", error);
        setError(`Failed to fetch: ${error.message}`);
        setLoading(false);
      });
  };

  const modalSetting = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12 border-2">
        <div className="flex justify-between p-4">
          <span className="font-bold text-xl">Manage Store</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 text-sm rounded"
            onClick={modalSetting}
          >
            Add Store
          </button>
        </div>
        
        {showModal && (
          <AddStore 
            fetchData={fetchData} 
            modalSetting={modalSetting} 
          />
        )}
        
        {loading && (
          <div className="text-center p-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading stores...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 m-4 rounded">
            <p className="font-bold">Error: Failed to fetch</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3"
              onClick={fetchData}
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && stores.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            <p className="text-lg">No stores found.</p>
            <p className="text-sm mt-2">Click "Add Store" to create your first store.</p>
          </div>
        )}
        
        {!loading && !error && stores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {stores.map((element) => (
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                key={element._id}
              >
                <div className="h-48 bg-gray-200">
                  {element.image ? (
                    <img
                      alt={element.name}
                      className="h-full w-full object-cover"
                      src={element.image}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{element.name}</h3>
                  <div className="flex items-start gap-2 text-gray-600 text-sm">
                    <img
                      alt="location"
                      className="h-5 w-5 mt-0.5"
                      src={require("../assets/location-icon.png")}
                    />
                    <span>{element.address}{element.city ? `, ${element.city}` : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Store;
