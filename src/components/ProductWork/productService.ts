import axios from "axios";

const getAllProducts = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/product");
    console.log("Products fetched:", response.data);  // Log the response data
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const getProductById = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/product/${id}`);
    console.log("Single product fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

// Place a bid
export const placeBid = async (productId: string, price: number) => {
  const response = await axios.post(`http://localhost:5000/api/bidding/${productId}`, { price });
  return response.data;
};



// Get bidding history
export const getBiddingHistory = async (productId: string) => {
  const res = await axios.get(`http://localhost:5000/api/bidding/${productId}`); 
  return res.data;
};



export { getAllProducts, getProductById };


