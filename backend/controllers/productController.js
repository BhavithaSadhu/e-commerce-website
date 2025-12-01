// function for adding product
import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js";
const addProduct = async (req,res)=>
{
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

const image1 = req.files?.image1?.[0] ?? null;
const image2 = req.files?.image2?.[0] ?? null;
const image3 = req.files?.image3?.[0] ?? null;
const image4 = req.files?.image4?.[0] ?? null;

const images = [image1, image2, image3, image4].filter(item => item != null);

let imagesUrl = await Promise.all(
  images.map(async (item) => {
    const uploadPath = item.path ?? item.filename;
    const result = await cloudinary.uploader.upload(uploadPath, { resource_type: 'image' });
    return result.secure_url;
  })
);

const parsedSizes = (() => {
  try { return sizes ? JSON.parse(sizes) : []; } catch { return Array.isArray(sizes) ? sizes : []; }
})();

const productData = {
  name,
  description,
  category,
  price: Number(price),
  subCategory,
  bestseller: bestseller === "true" ? "true" : "false",
  sizes: parsedSizes,
  image: imagesUrl,
  date: Date.now()
};
       
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

// function for listing products
const listProduct = async (req,res)=>
{
    try {
        const products = await productModel.find({});
        res.json({success:true,products})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}

//function for  remove product
const removeProduct = async (req,res)=>
{
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product removed"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//function for single product info

const singleProduct = async (req,res)=>
{

    try {
        const {productId} = req.body;
        const product = await productModel.findById(productId)
        res.json({success:true,product})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

export {listProduct,addProduct,removeProduct,singleProduct};