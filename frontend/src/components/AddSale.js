import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddSale({
  addSaleModalSetting,
  products,
  stores,
  handlePageUpdate,
  authContext,
}) {
  const [sale, setSale] = useState({
    userId: authContext.user,
    productId: "",
    storeId: "",
    stockSold: "",
    saleAmount: "",
    saleDate: new Date().toISOString().split('T')[0]
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setSale({ ...sale, [key]: value });
  };

  const addSale = () => {
    console.log("📤 Sending sale data:", sale);

    // Validation
    if (!sale.productId || !sale.storeId || !sale.stockSold || !sale.saleAmount) {
      alert("Please fill in all fields!");
      return;
    }

    fetch("http://localhost:4000/api/sales/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(sale),
    })
      .then((response) => {
        console.log("📥 Response status:", response.status);
        return response.json();
      })
      .then((result) => {
        console.log("✅ Sale added:", result);
        alert("Sale ADDED");
        handlePageUpdate();
        addSaleModalSetting();
      })
      .catch((err) => {
        console.error("❌ Error adding sale:", err);
        alert("Error adding sale!");
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
                        Add Sale
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          {/* Product Dropdown */}
                          <div>
                            <label
                              htmlFor="productId"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Product
                            </label>
                            <select
                              id="productId"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                              name="productId"
                              value={sale.productId}
                              onChange={(e) =>
                                handleInputChange("productId", e.target.value)
                              }
                            >
                              <option value="">Select Product</option>
                              {products.map((product) => (
                                <option key={product._id} value={product._id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Stock Sold */}
                          <div>
                            <label
                              htmlFor="stockSold"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Stock Sold
                            </label>
                            <input
                              type="number"
                              name="stockSold"
                              id="stockSold"
                              value={sale.stockSold}
                              onChange={(e) =>
                                handleInputChange("stockSold", e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="0 - 999"
                            />
                          </div>

                          {/* Store Dropdown */}
                          <div>
                            <label
                              htmlFor="storeId"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Store
                            </label>
                            <select
                              id="storeId"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                              name="storeId"
                              value={sale.storeId}
                              onChange={(e) =>
                                handleInputChange("storeId", e.target.value)
                              }
                            >
                              <option value="">Select Store</option>
                              {stores.map((store) => (
                                <option key={store._id} value={store._id}>
                                  {store.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Sale Amount */}
                          <div>
                            <label
                              htmlFor="saleAmount"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Sale Amount
                            </label>
                            <input
                              type="number"
                              name="saleAmount"
                              id="saleAmount"
                              value={sale.saleAmount}
                              onChange={(e) =>
                                handleInputChange("saleAmount", e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="$299"
                            />
                          </div>

                          {/* Sale Date */}
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="saleDate"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Sale Date
                            </label>
                            <input
                              type="date"
                              name="saleDate"
                              id="saleDate"
                              value={sale.saleDate}
                              onChange={(e) =>
                                handleInputChange("saleDate", e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={addSale}
                  >
                    Add Sale
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addSaleModalSetting()}
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