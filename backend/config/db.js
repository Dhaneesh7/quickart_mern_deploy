const mongoose=require('mongoose');
require('dotenv').config();

const connectdb=async () => {
    try{
        await
mongoose.connect(process.env.MONGO_URI);
    console.log("connection created");
} catch (err) {
        console.log("connection not created",err);

}
};
module.exports= connectdb;