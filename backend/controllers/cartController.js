// const User=require('../models/User')
//  const getCarts=async (req,res)=>{
// //      try{const products=await Product.find({_id:{$in: req.user.cartItems}});
// //      const cartItems=products.map((product)=>{
// //          const item=req.user.cartItems.find((cartItem)=>cartItem.id===product.id);
// //          return {...product.toJSON(),quantity:item.quantity}
// //      })
// //      res.json(cartItems);
// //  }catch(err){
// //      res.status(500).json({message:"failed to fetch",err})
// //  }
// const users= await User.findById(req.params.userId).populate('cartItems.product');
// if(!users)
//     {
//          return res.json({ message: 'User not found'});
//     }
//     console.log("cart",users.cartItems)
// res.json(users.cartItems);
//  };
//  const addToCarts=async (req,res)=>{
//      try{
// //   const {productId}=req.body;
// //   const user=req.user;
// //   const existingItem= user.cartItems.find((item)=>item.id===productId);
// //      if(existingItem){
// //          existingItem.quantity+=1;
// //      }
// //      else{
// //          user.cartItems.push(productId)
// //      }
// //      await user.save();
// //      res.json(user.cartItems)
//     const {productId,quantity=1}=req.body;
//     const user= await User.findById(req.params.userId);
//     if(!user) 
//         {
//             return res.json({message: "user not found"});
//         }

//         const existingItem=user.cartItems.find(
//             (item)=>item.product.toString()===productId
//         );
//         if(existingItem)
//         {
//             existingItem.quantity+= quantity;
//         }
//         else{
//             user.cartItems.push({product: productId,quantity});

//         }
//     await user.save();
//        const updatedUser = await User.findById(req.params.userId).populate('cartItems.product');

//     res.status(200).json(updatedUser.cartItems);
//     // res.json(user.cartItems);
//  }catch(err){
//      res.status(500).json({message:"failed to add to cart",err})
//  }
//  };
//  const removeAllFromCart = async (req, res) => {
// 	try {
//            const user = await User.findById(req.params.userId);
//     if (!user) return res.status(404).json({ message: "User not found" });
// 		const { productId } = req.body;
	
// 		if (!productId) {
// 			user.cartItems = [];
// 		} else {
// 			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
// 		}
// 		await user.save();
// 		res.json(user.cartItems);
// 	} catch (error) {
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };
// module.exports={getCarts,addToCarts,removeAllFromCart};
const User = require('../models/User');
const Product=require('../models/Product')
const getCarts = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('cartItems.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.cartItems);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart items", err });
  }
};

const addToCarts = async (req, res) => {
  try {
    const { productId,quantity =1} = req.body;
     // Check productId sent
    if (!productId) return res.status(400).json({ message: "productId is required" });

    // Check product exists
    const productExists = await Product.findById(productId);
    if (!productExists) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingItem = user.cartItems.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartItems.push({ product: productId, quantity });
    }
    await user.save();

    const updatedUser = await User.findById(req.params.userId).populate('cartItems.product');
    res.status(200).json(updatedUser.cartItems);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart", error:err.message || err });
  }
};

const removeAllFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { productId } = req.body;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId} = req.params;
    const { productId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
    await user.save();

    const updatedUser = await User.findById(userId).populate('cartItems.product');
    res.json(updatedUser.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove product", error: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const cartItem = user.cartItems.find(item => item.product.toString() === productId);
    if (!cartItem) return res.status(404).json({ message: "Product not found in cart" });

    cartItem.quantity = quantity;
    await user.save();

    const updatedUser = await User.findById(userId).populate('cartItems.product');
    res.json(updatedUser.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity", error: error.message });
  }
};

module.exports = {
  getCarts,
  addToCarts,
  removeAllFromCart,
  removeFromCart,
  updateQuantity,
};
