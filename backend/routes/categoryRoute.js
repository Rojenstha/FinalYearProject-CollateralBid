const express = require("express");
const {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, isAdmin } = require("../middleWare/authMiddleWare");

const categoryRoute = express.Router();

categoryRoute.post("/", createCategory);
categoryRoute.get("/", getAllCategory);
categoryRoute.get("/:id", getCategory);
categoryRoute.put("/:id", updateCategory);
categoryRoute.delete("/:id",  deleteCategory);

module.exports = categoryRoute;