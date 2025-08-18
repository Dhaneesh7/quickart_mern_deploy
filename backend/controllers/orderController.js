const User = require('../models/User');
const Product = require('../models/Product');
const redis = require('../config/redis');
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getOrder = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('orderItems.product');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, orderItems: user.orderItems });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch order items", error: err.message });
  }
};

const confirmOrder = async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ success: false, message: "Missing session_id" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items.data.price.product', 'customer_details'],
    });

    let email = session.customer_details?.email || await redis.get(`stripe_session:${session.id}`);
    if (!email) return res.status(404).json({ success: false, message: "Email not found in session" });

    const user = await User.findOne({ email }).populate('orderItems.product');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let existingOrder = await Order.findOne({ stripeSessionId: session.id });

    if (!existingOrder) {
      existingOrder = await Order.create({
        user: user._id,
        email,
        total: session.amount_total / 100,
        lineItems: session.line_items?.data,
        stripeSessionId: session.id,
      });

      for (const item of session.line_items.data) {
        const product = await Product.findOne({ name: item.description });
        if (product) {
          const existingItem = user.orderItems.find(i => i.product && i.product.toString() === product._id.toString());
          if (existingItem) existingItem.quantity += item.quantity;
          else user.orderItems.push({ product: product._id, quantity: item.quantity });
        }
      }
      await user.save();
    }

    res.json({ success: true, order: existingOrder, orderItems: user.orderItems });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error confirming order", error: error.message });
  }
};

const addCartToStore = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('cartItems.product').populate('orderItems.product');

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ✅ Filter first
    user.cartItems = (user.cartItems || []).filter(item => item.product);

    if (user.cartItems.length === 0) return res.status(400).json({ success: false, message: "Cart is empty" });

    for (const cartItem of user.cartItems) {
      const existingOrderItem = user.orderItems.find(
        item => item.product && item.product.toString() === cartItem.product._id.toString()
      );

      if (existingOrderItem) existingOrderItem.quantity += cartItem.quantity;
      else user.orderItems.push({ product: cartItem.product._id, quantity: cartItem.quantity });
    }

    user.cartItems = [];
    await user.save();

    const updatedUser = await User.findById(userId).populate('orderItems.product');
    res.status(200).json({ success: true, message: "Cart moved to order successfully", orderItems: updatedUser.orderItems });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to move cart to order", error: err.message });
  }
};

const addOrder = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const { userId } = req.params;

    if (!productId) return res.status(400).json({ success: false, message: "productId is required" });

    const productExists = await Product.findById(productId);
    if (!productExists) return res.status(404).json({ success: false, message: "Product not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const existingItem = user.orderItems.find(item => item.product && item.product.toString() === productId);
    if (existingItem) existingItem.quantity += quantity;
    else user.orderItems.push({ product: productId, quantity });

    await user.save();

    const updatedUser = await User.findById(userId).populate('orderItems.product');
    res.status(200).json({ success: true, message: "Order updated", orderItems: updatedUser.orderItems });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add order", error: err.message });
  }
};

const removeFromOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.orderItems = user.orderItems.filter(item => item._id.toString() !== orderId);
    await user.save();

    const updatedUser = await User.findById(userId).populate('orderItems.product');
    res.json({ success: true, message: "Product removed from order", orderItems: updatedUser.orderItems });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove product", error: error.message });
  }
};

module.exports = { getOrder, addOrder, removeFromOrder, confirmOrder, addCartToStore };
