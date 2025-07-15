const mongoose=require('mongoose');
require('dotenv').config();

const connectdb=async () => {
    try{
mongoose.connect(process.env.MONGO_URI);
    console.log("connection created");
} catch (err) {
        console.log("connection not created",err);

}
};
module.exports= connectdb;