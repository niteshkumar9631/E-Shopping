import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 40;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Helper to get Authorization header
  const getAuthHeader = (customToken) => {
    const authToken = customToken || token;
    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
  };

  // Add product to cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select a size for the product");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: getAuthHeader() }
        );
        toast.success("Added to cart");
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: getAuthHeader() }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  // Get total cart items
  const getCartItems = () =>
    Object.values(cartItems).reduce(
      (total, sizes) => total + Object.values(sizes).reduce((sum, qty) => sum + qty, 0),
      0
    );

  // Get total cart amount
  const getCartAmount = () =>
    Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
      const product = products.find((p) => p._id === itemId);
      if (!product) return total;
      return total + Object.values(sizes).reduce((sum, qty) => sum + qty * product.price, 0);
    }, 0);

  // Get products data
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) setProducts(response.data.products);
      else toast.error(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Get user cart data
  const getUserCart = async (customToken) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: getAuthHeader(customToken) }
      );
      if (response.data.success) setCartItems(response.data.cartData);
      else toast.error(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Load products
  useEffect(() => {
    getProductsData();
  }, []);

  // Load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      getUserCart(savedToken);
    }
  }, []);

  return (
    <ShopContext.Provider
      value={{
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        setCartItems,
        getCartItems,
        getCartAmount,
        updateQuantity,
        navigate,
        backendUrl,
        token,
        setToken,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
