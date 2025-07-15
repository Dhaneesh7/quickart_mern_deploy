    const Product=require('../models/Product')
    const getProducts=async (req,res)=>{
        try{const products=await Product.find();
        res.json(products);
    }catch(err){
        res.status(500).json({message:"failed to fetch",err})
    }
    };
    const insertProducts=async (req,res)=>{
        
        try{

            const{name,price,description,image,category}=req.body;
                const { userId } = req.params
        const products=await Product.create({name,price,description,image,category, createdBy: userId, });
            // await products.save();
        res.json(products);
    }catch(err){
        res.status(500).json({message:"failed to insert",error: err.message})
    }
    };
    const getProductsByCategory =async (req,res)=>{
        try{
            const{ category}=req.params;
            const products= await Product.find({category});
        res.json(products);
    }catch(err){
        res.status(500).json({message:"failed to get by category",err})
    }
    };

    const getProductById = async(req, res) => {
    const { productId } = req.params;
    const product =await Product.findById(productId).lean();
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
    };
    const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', err });
  }
};

    module.exports={getProducts,insertProducts,getProductsByCategory,getProductById,deleteProduct};