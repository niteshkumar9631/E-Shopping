import express from 'express';
import { listProducts, addProduct, removeProduct, singleProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import Product from '../models/productModel.js';
import { v2 as cloudinary } from "cloudinary";

const productRouter = express.Router();

/* --------------------  ADMIN ROUTES (Must be before public routes)  -------------------- */

// Add product
productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

// Remove product
productRouter.post('/remove', adminAuth, removeProduct);

// Admin: fetch single product for editing (uses same controller as public route)
productRouter.get('/admin/:id', adminAuth, (req, res, next) => {
  // Reuse productId parameter name for singleProduct controller
  req.params.productId = req.params.id;
  next();
}, singleProduct);

/* --------------------  PUBLIC ROUTES  -------------------- */

// Public: List products (must be BEFORE /:productId to avoid route conflicts)
productRouter.get('/list', listProducts);

// Public: Single product (alternative route - uses same controller)
productRouter.get('/public/:id', (req, res, next) => {
  // Reuse productId parameter name for singleProduct controller
  req.params.productId = req.params.id;
  next();
}, singleProduct);

// Public: Single product by ID (frontend and admin use this: /api/product/:productId)
// MUST be last because it matches any string, including "list" and "admin"
productRouter.get('/:productId', singleProduct);

// Update product
productRouter.put(
  '/update/:id',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Get existing product first to preserve existing images
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      // Start with existing images
      let finalImages = existingProduct.image ? [...existingProduct.image] : [];

      // Handle uploaded images - replace only the positions that have new uploads
      if (req.files) {
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        // Upload new images to Cloudinary and replace at specific positions
        const imageUploads = [
          { file: image1, index: 0 },
          { file: image2, index: 1 },
          { file: image3, index: 2 },
          { file: image4, index: 3 }
        ].filter(item => item.file); // Only keep entries with files

        // Upload all new images in parallel
        if (imageUploads.length > 0) {
          const uploadResults = await Promise.all(
            imageUploads.map(item => 
              cloudinary.uploader.upload(item.file.path, { resource_type: 'image' })
            )
          );

          // Replace images at the correct positions
          imageUploads.forEach((item, idx) => {
            finalImages[item.index] = uploadResults[idx].secure_url;
          });
        }

        updateData.image = finalImages;
      }

      // Parse sizes if provided
      if (updateData.sizes) {
        updateData.sizes = typeof updateData.sizes === 'string' 
          ? JSON.parse(updateData.sizes) 
          : updateData.sizes;
      }

      // Convert price to number if provided
      if (updateData.price) {
        updateData.price = Number(updateData.price);
      }

      // Convert bestseller to boolean if provided
      if (updateData.bestseller !== undefined) {
        updateData.bestseller = updateData.bestseller === "true" || updateData.bestseller === true;
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default productRouter;
