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
export const placeBid = async (productId: string, increment: number) => {
  try {
    const response = await axios.post("http://localhost:5000/api/bidding", {
      productId,
      increment, // rename to "price" if your backend expects that
    });
    return response.data;
  } catch (error: any) {
    console.error("Error placing bid:", error.response?.data || error.message);
    throw error;
  }
};




// Get bidding history
export const getBiddingHistory = async (productId: string) => {
  const res = await axios.get(`http://localhost:5000/api/bidding/${productId}`); 
  return res.data;
};



export { getAllProducts, getProductById };


