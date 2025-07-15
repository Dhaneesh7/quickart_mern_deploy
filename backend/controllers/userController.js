const User = require('../models/User');
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching user by ID:", err);
        res.status(500).json({ message: "Failed to fetch user", err });
    }
}
const getUsers=async (req,res)=>{
    try{
        const Users=await User.find();
        console.log("got user");
    res.json(Users);
}catch(err){
    res.status(500).json({message:"failed to fetch",err})
}
};
const insertUsers=async (req,res)=>{
    try{
        
//  const Users= new User.create(req.body);
const { name,email,role,password}=req.body;
 const Users =await User.create({name,email,role,password});
        // await Users.save();
    res.json(Users);
}catch(err){
    console.error("error creating user",err)
    res.status(500).json({message:"failed to fetch",err})
}
};
module.exports={getUsers,insertUsers,getUserById};