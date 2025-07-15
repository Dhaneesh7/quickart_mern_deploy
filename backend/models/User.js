// // models/Product.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const userSchema = new mongoose.Schema({
//   name: String,
  
//   email: String,
//   phone: Number,
//   password: String,
//   cartItems: [
// 			{
// 				quantity: {
// 					type: Number,
// 					default: 1,
// 				},
// 				product: {
// 					type: mongoose.Schema.Types.ObjectId,
// 					ref: "Products",
// 				},
// 			},
// 		],
// 		role: {
// 			type: String,
// 			enum: ["customer", "admin"],
// 			default: "customer",
// 		},
// 		password: {
// 			type: String
// 		}
		
  
// });
// // Pre-save hook to hash password before saving to database
// userSchema.pre("save", async function (next) {
// 	if (!this.isModified("password")) return next();

// 	try {
// 		const salt = await bcrypt.genSalt(10);
// 		this.password = await bcrypt.hash(this.password, salt);
// 		next();
// 	} catch (error) {
// 		next(error);
// 	}
// });

// userSchema.methods.comparePassword = async function (password) {
// 	return bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model('User', userSchema);
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  password: {
    type: String,
    required: true,
    
  select: false,
  },
  cartItems: [
    {
      quantity: {
        type: Number,
        default: 1,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    },
  ],
    orderItems: [
    {
      quantity: {
        type: Number,
        default: 1,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    },
  ],
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
});

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
