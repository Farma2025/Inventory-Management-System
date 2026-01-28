import { Fragment, useRef, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import UploadImage from "./UploadImage";
import AuthContext from "../AuthContext";

export default function AddStore({ fetchData, modalSetting }) {
  const authContext = useContext(AuthContext);
  const [form, setForm] = useState({
    userId: authContext.user,
    name: "",
    category: "Electronics",
    address: "",
    city: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const addProduct = () => {
    // Validation
    if (!form.name || !form.city || !form.address) {
      alert("Please fill in all required fields (Name, City, Address)");
      return;
    }

    // Check if userId exists
    if (!form.userId) {
      alert("User not logged in. Please log in first.");
      return;
    }

    setLoading(true);
    setError(null);

    console.log("Sending store data:", form); // Debug log

    fetch("http://localhost:5000/api/store/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        console.log("Response status:", response.status); // Debug log
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log("Store added successfully:", result);
        alert("✅ STORE ADDED SUCCESSFULLY!");
        setLoading(false);
        setOpen(false);
        
        // Reset form for next use
        setForm({
          userId: authContext.user,
          name: "",
          category: "Electronics",
          address: "",
          city: "",
          image: "",
        });
        
        // Refresh the store list in parent component
        if (fetchData) {
          fetchData();
        }
        
        // Close the modal in parent component
        if (modalSetting) {
          modalSetting();
        }
      })
      .catch((err) => {
        console.error("Error adding store:", err);
        setError(err.message);
        setLoading(false);
        alert("❌ Error adding store: " + err.message);
      });
  };

  // Uploading image to cloudinary
  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "inventoryapp");

    setLoading(true);
    
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/ddhayhptm/image/upload", {
        method: "POST",
        body: data,
      });
      
      const result = await response.json();
      setForm({ ...form, image: result.url });
      alert("✅ Store Image Successfully Uploaded");
      setLoading(false);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("❌ Error uploading image");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (modalSetting) {
      modalSetting();
    }
  };

  return (
    // Modal
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={handleClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900 "
                      >
                        Add New Store
                      </Dialog.Title>
                      
                      {error && (
                        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                          ❌ Error: {error}
                        </div>
                      )}
                      
                      <form action="#" className="mt-4">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Store Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={form.name}
                              onChange={handleInputChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                              placeholder="e.g., SuperMart Downtown"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="city"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              City *
                            </label>
                            <input
                              type="text"
                              name="city"
                              id="city"
                              value={form.city}
                              onChange={handleInputChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                              placeholder="e.g., Los Angeles"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="category"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Category
                            </label>
                            <select
                              id="category"
                              name="category"
                              value={form.category}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  category: e.target.value,
                                })
                              }
                            >
                              <option value="Electronics">Electronics</option>
                              <option value="Groceries">Groceries</option>
                              <option value="Wholesale">WholeSale</option>
                              <option value="SuperMart">SuperMart</option>
                              <option value="Phones">Phones</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="address"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Address *
                            </label>
                            <textarea
                              id="address"
                              rows="4"
                              name="address"
                              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter full store address..."
                              value={form.address}
                              onChange={handleInputChange}
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                              Store Image (Optional)
                            </label>
                            <UploadImage uploadImage={uploadImage} />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    onClick={addProduct}
                    disabled={loading}
                  >
                    {loading ? "⏳ Adding..." : "✅ Add Store"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors"
                    onClick={handleClose}
                    ref={cancelButtonRef}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}