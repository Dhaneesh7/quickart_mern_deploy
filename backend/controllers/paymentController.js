const createCheckoutSession = async (req, res) => {
  try {
    console.log("⚠️ Incoming req.body:", req.body);

    const { productId, productName, name, email, phone, address, quantity, unitPriceRupees } = req.body;
    if (!productId || !productName || !name || !email || !quantity || !unitPriceRupees) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const unitPrice = parseInt(unitPriceRupees, 10);
    const qty = parseInt(quantity, 10);

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
              name: productName, // ✅ real product name
              description: `Order for ${productName} (ID: ${productId})`,
            },
          },
          quantity: qty,
        },
      ],
      mode: 'payment',
      metadata: {
        buyer_name: name,
        buyer_email: email,
        phone,
        address,
        productId,
        productName,
        quantity: qty.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/orders/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/orders/cancel`,
    });

    // Optional: store user ID or email → session in Redis
    await redis.set(`stripe_session:${session.id}`, email, "EX", 3600);

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
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

