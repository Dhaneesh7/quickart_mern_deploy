const express = require('express')
// const mongoose=require('mongoose')
const cors = require('cors')
require('dotenv').config();
const authRoutes = require('./routes/AuthRoutes');
const ProductRoutes = require('./routes/ProductRoutes')
const UserRoutes = require('./routes/UserRoutes')
const CartRoutes = require('./routes/CartRoutes')
const OrderRoutes = require('./routes/OrderRoutes')
const paymentroutes = require('./routes/PaymentRoutes')
const connectdb = require('./config/db');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());
const corsOptions = {
  // origin:  process.env.FRONTEND_URL, // Replace with your frontend's origin
  // origin: "https://quickart-mern-deploy-1.onrender.com",
  origin: "https://quickart-mern-deploy.vercel.app",

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"]

};
app.set('trust proxy', 1);
//   app.use(cors({
//   origin: process.env.FRONTEND_URL, // e.g. https://quickart-mern-deploy-1.onrender.com
//   credentials: true,
//   exposedHeaders: ['Set-Cookie']
// }));
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
connectdb();
// mongoose.connect("mongodb://localhost:27017/student").then(()=>{
//     console.log("connection created")
// }).catch((err)=>{
//         console.log("connection not created",err)

// })
app.use('/api/products', ProductRoutes)
app.use('/api/carts', CartRoutes)
app.use('/api/user', UserRoutes)
app.use("/api/auth", authRoutes);
app.use('/api/orders', OrderRoutes)
app.use('/api/payments', paymentroutes)

const PORT = parseInt(process.env.PORT, 10) || 5000
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
// const ProductRoutes=require('./routes/ProductRoutes');
// const cors = require('cors');
// const express = require('express');
// const CartRoutes= require('./routes/CartRoutes');
// const UserRoutes=require('./routes/UserRoutes');
// const authRoutes=require('./routes/AuthRoutes')
// const app = express();

// app.use(cors());

// app.use(express.json());

// // Your routes and other middleware...
// app.use('/api/products',ProductRoutes);
// app.use('/api/carts', CartRoutes);
// app.use('/user', UserRoutes);
// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
