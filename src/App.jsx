import React, { useState } from "react";
import { jsPDF } from "jspdf";

const InvoiceApp = () => {
  const [items, setItems] = useState([
    { id: Date.now(), name: "", description: "", quantity: 1, rate: 0, discount: 0, gst: 18 },
  ]);
  const [roundingOption, setRoundingOption] = useState(null);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", description: "", quantity: 1, rate: 0, discount: 0, gst: 18 }]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "quantity" || field === "rate" || field === "discount" || field === "gst" ? parseFloat(value) || 0 : value }
          : item
      )
    );
  };

  const calculateAmount = (item) => {
    const baseAmount = item.quantity * item.rate;
    const discountAmount = (baseAmount * item.discount) / 100;
    const gstAmount = ((baseAmount - discountAmount) * item.gst) / 100;
    return baseAmount - discountAmount + gstAmount;
  };

  const calculateTotal = () => {
    let total = items.reduce((total, item) => total + parseFloat(calculateAmount(item)), 0);
    if (roundingOption === "up") {
      total = Math.ceil(total);
    } else if (roundingOption === "down") {
      total = Math.floor(total);
    }
    return total.toFixed(2);
  };

  const downloadBill = () => {
    const doc = new jsPDF();
    doc.text("Invoice", 10, 10);
    let y = 20;

    items.forEach((item, index) => {
      doc.text(
        `Item ${index + 1}: ${item.name}, Qty: ${item.quantity}, Rate: ${item.rate}, Discount: ${item.discount}%, GST: ${item.gst}%, Amount: ${calculateAmount(item).toFixed(2)}`,
        10,
        y
      );
      y += 10;
    });

    doc.text(`Total: ${calculateTotal()}`, 10, y + 10);
    doc.save("invoice.pdf");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Invoice</h1>

      {/* Items List */}
      <div className="border rounded-lg p-4 shadow-md">
        <div className="flex font-semibold border-b pb-2 mb-2">
          <span className="flex-grow">Item Name</span>
          <span className="w-1/4 text-center">Description</span>
          <span className="w-16 text-center">Qty</span>
          <span className="w-20 text-center">Rate</span>
          <span className="w-20 text-center">Discount (%)</span>
          <span className="w-20 text-center">GST (%)</span>
          <span className="w-28 text-center">Amount</span>
          <span className="w-10"></span>
        </div>
        {items.map((item) => (
          <div key={item.id} className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleInputChange(item.id, "name", e.target.value)}
              className="flex-grow px-4 py-2 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleInputChange(item.id, "description", e.target.value)}
              className="w-1/4 px-4 py-2 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => handleInputChange(item.id, "quantity", e.target.value)}
              className="w-16 px-4 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Rate"
              value={item.rate}
              onChange={(e) => handleInputChange(item.id, "rate", e.target.value)}
              className="w-20 px-4 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Discount"
              value={item.discount}
              onChange={(e) => handleInputChange(item.id, "discount", e.target.value)}
              className="w-20 px-4 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="GST"
              value={item.gst}
              onChange={(e) => handleInputChange(item.id, "gst", e.target.value)}
              className="w-20 px-4 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="w-28 text-center">{calculateAmount(item).toFixed(2)}</span>
            <button
              onClick={() => removeItem(item.id)}
              className="w-10 text-red-500 hover:text-red-700 text-center"
            >
              ✖
            </button>
          </div>
        ))}
        <button
          onClick={addItem}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Add Item
        </button>
      </div>

      {/* Footer Section as per UI */}
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Add Discounts/Additional Charges</button>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="round"
                value="up"
                onChange={() => setRoundingOption("up")}
                className="form-radio"
              />
              <span>Round Up</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="round"
                value="down"
                onChange={() => setRoundingOption("down")}
                className="form-radio"
              />
              <span>Round Down</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between font-semibold">
          <span>Total (INR):</span>
          <span>{calculateTotal()}</span>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowDownloadPopup(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download Bill
          </button>
        </div>

        {showDownloadPopup && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Download Invoice</h2>
              <p>Click the button below to download your invoice in PDF format.</p>
              <button
                onClick={() => {
                  downloadBill();
                  setShowDownloadPopup(false);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download PDF
              </button>
              <button
                onClick={() => setShowDownloadPopup(false)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceApp;