import React, { useState, useEffect } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const EditProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subcategory, setSubcategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/${id}`, { headers: { token } });
        if (res.data.success) {
          const product = res.data.product;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setCategory(product.category);
          setSubcategory(product.subCategory);
          setBestseller(product.bestseller);
          setSizes(product.sizes || []);
          setExistingImages(product.image || []);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchProduct();
  }, [id, token]);

  // Update product
  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", Number(price));
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const res = await axios.put(`${backendUrl}/api/product/update/${id}`, formData, { headers: { token } });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/list"); // redirect to product list after update
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleSize = (size) => {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  return (
    <form onSubmit={updateProduct} className="flex flex-col w-full items-start gap-4 p-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
      <div className="w-full">
        <p className="mb-2 text-gray-700 font-semibold">Upload Image</p>
        <div className="flex gap-4">
          {[image1, image2, image3, image4].map((img, index) => (
            <label key={index} htmlFor={`image${index + 1}`} className="cursor-pointer">
              <img
                className="w-24 h-24 object-cover border rounded-md shadow-sm"
                src={
                  img
                    ? URL.createObjectURL(img)
                    : existingImages[index] || assets.upload_area
                }
                alt="Upload"
              />
              <input onChange={(e) => {
                const file = e.target.files[0];
                if (index === 0) setImage1(file);
                if (index === 1) setImage2(file);
                if (index === 2) setImage3(file);
                if (index === 3) setImage4(file);
              }} type="file" id={`image${index + 1}`} hidden />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 text-gray-700 font-semibold">Product Name</p>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" type="text" required />
      </div>

      <div className="w-full">
        <p className="mb-2 text-gray-700 font-semibold">Product Description</p>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" required />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div>
          <p className="mb-2 text-gray-700 font-semibold">Product Category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-gray-700 font-semibold">Sub Category</p>
          <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-gray-700 font-semibold">Product Price</p>
          <input value={price} onChange={(e) => setPrice(Number(e.target.value))} className="border rounded-md px-3 py-2 w-24 focus:ring-2 focus:ring-blue-400 focus:outline-none" type="number" required />
        </div>
      </div>

      <div>
        <p className="mb-2 text-gray-700 font-semibold">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size} onClick={() => toggleSize(size)}>
              <p className={`px-3 py-1 border rounded-md cursor-pointer transition-all duration-200 ${sizes.includes(size) ? "bg-blue-100 border-blue-500" : "bg-gray-200"}`}>{size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input checked={bestseller} onChange={() => setBestseller(prev => !prev)} type="checkbox" id="bestseller" className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-400" />
        <label className="cursor-pointer text-gray-700" htmlFor="bestseller">Add to Bestseller</label>
      </div>

      <button type="submit" className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all duration-200">UPDATE PRODUCT</button>
    </form>
  )
}

export default EditProduct;
