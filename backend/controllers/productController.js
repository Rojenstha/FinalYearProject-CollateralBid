const asyncHandler = require("express-async-handler")
const slugify = require("slugify");
const Product = require("../models/productModel")

const createProduct = asyncHandler(async(req, res) => {
  const { title, description, price, category, height, lengthpic, width, mediumused, weigth } = req.body;
  const userId = req.user.id;


  if (!title || !description || !price) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const originalSlug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  let slug = originalSlug;
  let suffix = 1;

  while (await Product.findOne({ slug })) {
    slug = `${originalSlug}-${suffix}`;
    suffix++;
  }

  const product = await Product.create({
    user: userId,
    title,
    slug: slug,
    description,
    price,
    category,
    height,
    lengthpic,
    width,
    mediumused,
    weigth,
  });
  res.status(201).json({
    success: true,
    data: product,
  });
});

const test = asyncHandler(async(req, res) => {
  res.send("test")
});
 
module.exports={
  createProduct,
};