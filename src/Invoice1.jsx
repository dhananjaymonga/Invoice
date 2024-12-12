// Install dependencies: React, Tailwind CSS, and jspdf for PDF generation
// Use this starter code in a React project

import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import './App.css'; // Ensure Tailwind is configured

function App1() {
  const [items, setItems] = useState([{ id: Date.now(), name: '', description: '', quantity: 1, price: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: 1,
    invoiceDate: new Date().toISOString().split('T')[0],
    billedBy: { 
      name: 'Dhananjay', 
      address: '', 
      city: 'Sirsa', 
      email: 'dhananjay.monga.10@gmail.com', 
      gst: 'GST1234567', 
      state: '' 
    },
    billedTo: { 
      name: '', 
      address: '', 
      email: '', 
      phone: '', 
      state: '', 
      pincode: '', 
      paymentMethod: '' 
    },
  });

  // Automatically increment invoice number
  useEffect(() => {
    const savedInvoiceNo = localStorage.getItem('invoiceNo');
    const nextInvoiceNo = savedInvoiceNo ? parseInt(savedInvoiceNo, 10) + 1 : 1;
    setInvoiceDetails((prev) => ({ ...prev, invoiceNo: nextInvoiceNo }));
    localStorage.setItem('invoiceNo', nextInvoiceNo);
  }, []);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '', description: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const discountAmount = (subtotal * discount) / 100;
    const gstAmount = ((subtotal - discountAmount) * gst) / 100;
    return (subtotal - discountAmount + gstAmount).toFixed(2);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Invoice", 10, 10);
    doc.text(`Invoice No: ${invoiceDetails.invoiceNo}`, 10, 20);
    doc.text(`Invoice Date: ${invoiceDetails.invoiceDate}`, 10, 30);
    doc.text(`Billed By: ${invoiceDetails.billedBy.name}`, 10, 40);
    doc.text(`Billed To: ${invoiceDetails.billedTo.name}`, 10, 50);

    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - ${item.description} - ${item.quantity} x ₹${item.price}`, 10, 60 + index * 10);
    });
    doc.text(`Total: ₹${calculateTotal()}`, 10, 60 + items.length * 10);
    doc.save("invoice.pdf");
  };

  return (
    <div className="container mx-auto p-4 max-w-screen-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Invoice Generator</h1>
      <div className="bg-white shadow-md rounded p-4">
        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-bold">Invoice No</label>
            <input
              type="text"
              placeholder="Invoice No"
              value={invoiceDetails.invoiceNo}
              readOnly
              className="border p-2 w-full bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block font-bold">Invoice Date</label>
            <input
              type="date"
              value={invoiceDetails.invoiceDate}
              onChange={(e) => setInvoiceDetails({ ...invoiceDetails, invoiceDate: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
        </div>

        {/* Billed By Section */}
        <div className="mb-4">
          <h2 className="font-bold">Billed By</h2>
          <input
            type="text"
            placeholder="Name"
            value={invoiceDetails.billedBy.name}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedBy: { ...invoiceDetails.billedBy, name: e.target.value } })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Address"
            value={invoiceDetails.billedBy.address}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedBy: { ...invoiceDetails.billedBy, address: e.target.value } })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="City"
            value={invoiceDetails.billedBy.city}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedBy: { ...invoiceDetails.billedBy, city: e.target.value } })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={invoiceDetails.billedBy.email}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedBy: { ...invoiceDetails.billedBy, email: e.target.value } })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="GST No"
            value={invoiceDetails.billedBy.gst}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedBy: { ...invoiceDetails.billedBy, gst: e.target.value } })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="State"
            value={invoiceDetails.billedBy.state}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedBy: { ...invoiceDetails.billedBy, state: e.target.value } })}
            className="border p-2 w-full"
          />
        </div>

        {/* Billed To Section */}
        <div className="mb-4">
          <h2 className="font-bold">Billed To</h2>
          <input
            type="text"
            placeholder="Name"
            value={invoiceDetails.billedTo.name}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedTo: { ...invoiceDetails.billedTo, name: e.target.value } })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Address"
            value={invoiceDetails.billedTo.address}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedTo: { ...invoiceDetails.billedTo, address: e.target.value } })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={invoiceDetails.billedTo.email}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedTo: { ...invoiceDetails.billedTo, email: e.target.value } })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Phone No"
            value={invoiceDetails.billedTo.phone}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedTo: { ...invoiceDetails.billedTo, phone: e.target.value } })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="State"
            value={invoiceDetails.billedTo.state}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedTo: { ...invoiceDetails.billedTo, state: e.target.value } })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Pincode"
            value={invoiceDetails.billedTo.pincode}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedTo: { ...invoiceDetails.billedTo, pincode: e.target.value } })}
            className="border p-2 w-full mb-2"
          />
          <select
            value={invoiceDetails.billedTo.paymentMethod}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, billedTo: { ...invoiceDetails.billedTo, paymentMethod: e.target.value } })}
            className="border p-2 w-full"
          >
            <option value="">Select Payment Method</option>
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        {/* Items Section */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-2 font-bold">
          <label className="col-span-2">Item Name</label>
          <label>Description</label>
          <label>Quantity</label>
          <label>Price</label>
          <label>Actions</label>
        </div>
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-2 items-center">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
              className="border p-2 col-span-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
              className="border p-2"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value))}
              className="border p-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))}
              className="border p-2"
            />
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Item
        </button>

        {/* Discount and GST Section */}
        <div className="mt-4">
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0">
            <div>
              <label className="font-bold">Discount (%)</label>
              <input
                type="number"
                placeholder="Discount (%)"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value))}
                className="border p-2 w-32"
              />
            </div>
            <div>
              <label className="font-bold">GST (%)</label>
              <input
                type="number"
                placeholder="GST (%)"
                value={gst}
                onChange={(e) => setGst(parseFloat(e.target.value))}
                className="border p-2 w-32"
              />
            </div>
          </div>
          <div className="text-right mt-4 font-bold">Total: ₹{calculateTotal()}</div>
        </div>

        {/* Download Button */}
        <button
          onClick={() => setShowPopup(true)}
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Download
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Download Options</h2>
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Download PDF
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App1;
