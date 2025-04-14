import axios from "axios";

export const submitBid = async (productId: string, bidAmount: number) => {
  const res = await axios.post(`/api/bidding/${productId}`, { bidAmount });
  return res.data;
};

export const getBiddingHistory = async (productId: string) => {
  const res = await axios.get(`/api/bidding/product/${productId}`);
  return res.data;
};
