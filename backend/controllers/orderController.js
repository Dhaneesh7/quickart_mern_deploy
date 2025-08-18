const User=require('../models/User');
const Product=require('../models/Product')
const redis = require('../config/redis');
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const getOrder = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('orderItems.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.orderItems);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order items", err });
  }
};
// const confirmOrder = async (req, res) => {
//   const { session_id } = req.query;

//   if (!session_id) {
//     return res.status(400).json({ message: "Missing session_id" });
//   }

//   try {
//     const session = await stripe.checkout.sessions.retrieve(session_id, {
//       expand: ['line_items', 'customer'],
//     });

//     // let email = session?.customer_email;
//     // if (!email) {
//     //   email = await redis.get(`stripe_session:${session.id}`);
//     // }
//     // if (!email) return res.status(404).json({ message: "Email not found in session" });
//     let email = session.customer_details?.email;
// if (!email) {
//   email = await redis.get(`stripe_session:${session.id}`);
// }
// if (!email) {
//   return res.status(404).json({ message: "Email not found in session" });
// }

//     const user = await User.findOne({ email }).select('_id name email');
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Optional: check for existing order
//     let order = await Order.findOne({ stripeSessionId: session.id });

//     if (!order) {
//       order = await Order.create({
//         user: user._id,
//         email,
//         total: session.amount_total / 100,
//         lineItems: session.line_items?.data,
//         stripeSessionId: session.id,
//       });
//     }

//     res.json({
//       user: { id: user._id, name: user.name, email: user.email },
//       order,
//     });

//   } catch (error) {
//     console.error("Error confirming order:", error);
//     console.error("Order confirmation error:", error.message);
//     res.status(500).json({ message: "Error confirming order" });
//   }
// };
const confirmOrder = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ message: "Missing session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items.data.price.product', 'customer_details'],
    });

    let email = session.customer_details?.email;
    if (!email) {
      email = await redis.get(`stripe_session:${session.id}`);
    }
    if (!email) {
      return res.status(404).json({ message: "Email not found in session" });
    }

    const user = await User.findOne({ email }).populate('orderItems.product');
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if order already exists
    let existingOrder = await Order.findOne({ stripeSessionId: session.id });

    if (!existingOrder) {
      // Create new order
      existingOrder = await Order.create({
        user: user._id,
        email,
        total: session.amount_total / 100,
        lineItems: session.line_items?.data,
        stripeSessionId: session.id,
      });

      // 🔁 Add line items to user's orderItems
      for (const item of session.line_items.data) {
        const productName = item.description;
        const quantity = item.quantity;

        // Find product in your DB using name (or use metadata if you store Stripe productId)
        const product = await Product.findOne({ name: productName });

        if (product) {
          const existingItem = user.orderItems.find(i => i.product.toString() === product._id.toString());
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            user.orderItems.push({ product: product._id, quantity });
          }
        }
      }

      await user.save(); // Save updated user with new orderItems
    }

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      order: existingOrder,
    });

  } catch (error) {
    console.error("Error confirming order:", error.message);
    res.status(500).json({ message: "Error confirming order" });
  }
};

const addCartToStore = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Find user with cart populated
    const user = await User.findById(userId)
      .populate('cartItems.product')
      .populate('orderItems.product');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cartItems || user.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Move cart items to orderItems
    for (const cartItem of user.cartItems) {
      const existingOrderItem = user.orderItems.find(
        (item) => item.product.toString() === cartItem.product._id.toString()
      );

      if (existingOrderItem) {
        existingOrderItem.quantity += cartItem.quantity;
      } else {
        user.orderItems.push({
          product: cartItem.product._id,
          quantity: cartItem.quantity,
        });
      }
    }

    // 3. Clear the cart
    user.cartItems = [];

    // 4. Save user
    await user.save();

    const updatedUser = await User.findById(userId).populate('orderItems.product');
    res.status(200).json({
      message: "Cart moved to order successfully",
      orderItems: updatedUser.orderItems,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to move cart to order", error: err.message });
  }
};

const addOrder = async (req, res) => {
  try {
    const { productId,quantity =1} = req.body;
    const userId = req.params.userId;
     // Check productId sent
    if (!productId) return res.status(400).json({ message: "productId is required" });

    // Check product exists
    const productExists = await Product.findById(productId);
    if (!productExists) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingItem = user.orderItems.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.orderItems.push({ product: productId, quantity });
    }
    await user.save();

    const updatedUser = await User.findById(userId).populate('orderItems.product');
    res.status(200).json(updatedUser.orderItems);
  } catch (err) {
    res.status(500).json({ message: "Failed to add orders", error:err.message || err });
  }
};
const removeFromOrder = async (req, res) => {
  try {
    const { userId,orderId} = req.params;
 
    console.log("userId:", userId);
    // const { productId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.orderItems = user.orderItems.filter(item => item._id.toString() !== orderId);
    await user.save();

    const updatedUser = await User.findById(userId).populate('orderItems.product');
    res.json({orderItems:updatedUser.orderItems});
  } catch (error) {
    res.status(500).json({ message: "Failed to remove product", error: error.message });
  }
};
module.exports = {
  getOrder,
    addOrder,
    removeFromOrder,
    confirmOrder,
    addCartToStore
};