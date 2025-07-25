// const Stripe = require('stripe');
// const dotenv = require('dotenv');
// const redis = require('../config/redis.js');
// dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const createCheckoutSession = async (req, res) => {
//   try {
//     console.log("⚠️ Incoming req.body:", req.body);

//     const { productId, name, email, phone, address, quantity, unitPriceRupees } = req.body;
//     const unitPrice = parseInt(unitPriceRupees, 10);
//     const qty = parseInt(quantity, 10);

//     if (isNaN(unitPrice) || isNaN(qty)) {
//       return res.status(400).json({ error: "Invalid price or quantity" });
//     }

//     const totalAmountPaise = unitPrice * 100 * qty;
//     if (totalAmountPaise < 5000) {
//       return res.status(400).json({ error: "Minimum order amount is ₹50" });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       customer_email: email,
//       line_items: [
//         {
//           price_data: {
//             currency: 'inr',
//             unit_amount: unitPrice * 100,
//             product_data: {
//               name,
//               description: `Order for Product ID: ${productId}`,
//             },
//           },
//           quantity: qty,
//         },
//       ],
//       mode: 'payment',
//       metadata: {
//         phone,
//         address,
//         productId,
//         quantity: qty.toString(),
//       },
//       success_url: `${process.env.CLIENT_URL}/orders/confirm?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/orders/cancel`,
//     });

//     const userId = req.user.userId; // make sure req.user is populated
//     await redis.set(`stripe_session:${session.id}`, userId.toString(), "EX", 3600);

//     res.status(200).json({ sessionId: session.id });
//   } catch (error) {
//     console.error("Stripe Checkout error:", error);
//     res.status(500).json({ error: 'Payment session creation failed' });
//   }
// };

// const createBulkCheckout = async (req, res) => {
//   const { cart } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.create({
//       client_reference_id: req.user.userId.toString(),
//       payment_method_types: ['card'],
//       line_items: cart.map(item => ({
//         price_data: {
//           currency: 'inr',
//           product_data: {
//             name: item.name,
//           },
//           unit_amount: item.price * 100,
//         },
//         quantity: item.quantity,
//       })),
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL}/orders/confirm?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/orders/cancel`,
//     });

//     await redis.set(`stripe_session:${session.id}`, req.user.userId.toString(), "EX", 3600);

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error("Stripe Bulk Checkout Error:", err.message);
//     res.status(500).json({ message: 'Error processing checkout', error: err.message });
//   }
// };

// module.exports = {
//   createCheckoutSession,
//   createBulkCheckout,
// };
const Stripe = require('stripe');
const dotenv = require('dotenv');
const redis = require('../config/redis.js');
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Single product checkout
const createCheckoutSession = async (req, res) => {
  try {
    console.log("⚠️ Incoming req.body:", req.body);
console.log("Cookies:", req.cookies);
console.log("Access Token:", req.cookies.accessToken);

    const { productId, name, email, phone, address, quantity, unitPriceRupees } = req.body;
        if (!productId || !name || !email || !quantity || !unitPriceRupees) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const unitPrice = parseInt(unitPriceRupees, 10);
    const qty = parseInt(quantity, 10);

    // if (isNaN(unitPrice) || isNaN(qty)) {
    //   return res.status(400).json({ error: "Invalid price or quantity" });
    // }

    const totalAmountPaise = unitPrice * 100 * qty;
    if (totalAmountPaise < 5000) {
      return res.status(400).json({ error: "Minimum order amount is ₹50" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            unit_amount: unitPrice * 100,
            product_data: {
              name,
              description: `Order for Product ID: ${productId}`,
            },
          },
          quantity: qty,
        },
      ],
      mode: 'payment',
      // metadata: {
      //   phone,
      //   address,
      //   productId,
      //   quantity: qty.toString(),
      // },
      success_url: `${process.env.CLIENT_URL}/orders/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/orders/cancel`,
    });

    const userId = req.user?.userId;
    // if (!userId) return res.status(401).json({ error: "Unauthorized user" });
// console.log("Creating checkout session for user:", userId, "with product ID:", productId);
console.log("Creating checkout session for user:", email, "with product ID:", productId);
    // await redis.set(`stripe_session:${session.id}`, userId.toString(), "EX", 3600); // 1 hour
    await redis.set(`stripe_session:${session.id}`,email, "EX", 3600); // 1 hour

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Checkout error:", error);
     console.error("Stripe Checkout error:", error.message);
    res.status(500).json({ error: 'Payment session creation failed' });
  }
};

// Bulk checkout (e.g., cart checkout)
const createBulkCheckout = async (req, res) => {
  try {
    console.log("Cookies:", req.cookies);
console.log("Access Token:", req.cookies.accessToken);

    const { cart } = req.body;
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart must contain at least one item" });
    }

    const userId = req.user?.userId;
    // if (!userId) return res.status(401).json({ error: "Unauthorized user" });
console.log("Creating bulk checkout session for user:", userId, "with cart:", cart);
    const session = await stripe.checkout.sessions.create({
      client_reference_id: userId.toString(),
      payment_method_types: ['card'],
      line_items: cart.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/orders/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/orders/cancel`,
    });

    // await redis.set(`stripe_session:${session.id}`, userId.toString(), "EX", 3600);
    await redis.set(`stripe_session:${session.id}`, userId.toString(), "EX", 3600);

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Bulk Checkout Error:", err.message);
    res.status(500).json({ message: 'Error processing checkout', error: err.message });
  }
};

module.exports = {
  createCheckoutSession,
  createBulkCheckout,
};

