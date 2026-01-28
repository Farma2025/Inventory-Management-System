import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";

export default function AddProduct({
  addProductModalSetting,
  handlePageUpdate,
  showToast,
}) {
  const authContext = useContext(AuthContext);
  const [product, setProduct] = useState({
    userId: authContext.user,
    name: "",
    manufacturer: "",
    description: "",
    stock: 0,
  });
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setProduct({ ...product, [key]: value });
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!product.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!product.manufacturer.trim()) {
      newErrors.manufacturer = "Manufacturer is required";
    }
    if (!product.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (product.stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addProduct = () => {
    if (!validateForm()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsLoading(true);

    fetch("http://localhost:4000/api/product/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((result) => {
        showToast("Product added successfully!", "success");
        handlePageUpdate();
        addProductModalSetting();
      })
      .catch((err) => {
        console.log(err);
        showToast("Failed to add product. Please try again.", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
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
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        Add Product
                      </Dialog.Title>
                      <form action="#" className="mt-4">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          {/* Product Name */}
                          <div>
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={product.name}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className={`bg-gray-50 border ${
                                errors.name ? "border-red-500" : "border-gray-300"
                              } text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5`}
                              placeholder="Ex. Apple iMac 27"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                          </div>

                          {/* Manufacturer */}
                          <div>
                            <label
                              htmlFor="manufacturer"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Manufacturer <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="manufacturer"
                              id="manufacturer"
                              value={product.manufacturer}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className={`bg-gray-50 border ${
                                errors.manufacturer ? "border-red-500" : "border-gray-300"
                              } text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5`}
                              placeholder="Ex. Apple"
                            />
                            {errors.manufacturer && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.manufacturer}
                              </p>
                            )}
                          </div>

                          {/* Stock Quantity */}
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="stock"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Stock Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="stock"
                              id="stock"
                              min="0"
                              value={product.stock}
                              onChange={(e) =>
                                handleInputChange(e.target.name, parseInt(e.target.value) || 0)
                              }
                              className={`bg-gray-50 border ${
                                errors.stock ? "border-red-500" : "border-gray-300"
                              } text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5`}
                              placeholder="0"
                            />
                            {errors.stock && (
                              <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                            )}
                          </div>

                          {/* Description */}
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="description"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id="description"
                              rows="5"
                              name="description"
                              className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                                errors.description ? "border-red-500" : "border-gray-300"
                              } focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="Write a description..."
                              value={product.description}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            />
                            {errors.description && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    disabled={isLoading}
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={addProduct}
                  >
                    {isLoading ? "Adding..." : "Add Product"}
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50"
                    onClick={() => addProductModalSetting()}
                    ref={cancelButtonRef}
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