const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  total: { type: Number, required: true },             // in your currency, e.g. INR
  lineItems: { type: Array, default: [] },              // session.line_items.data
  stripeSessionId: { type: String, unique: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
