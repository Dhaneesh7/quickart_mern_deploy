// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  category: { type: String },
image: { type: String } // Store file path

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
