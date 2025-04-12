const asyncHandler = require("express-async-handler")
const path = require("path")
const slugify = require("slugify");
const cloudinary = require("cloudinary")
const Product = require("../models/productModel")

const createProduct = asyncHandler(async(req, res) => {
  console.log("File received:", req.file);
  const { title, description, price, category, height, lengthpic, width, mediumused, weigth } = req.body;
  const userId = req.user.id;

  console.log("CREATE PRODUCT BODY:", req.body);

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

  let fileData = {};
  if (req.file) {
    let uploadedFile;
    try {
      const normalizedPath = path.resolve(req.file.path);
      uploadedFile = await cloudinary.uploader.upload(normalizedPath, {
        folder: "Bidding/Product",
        resource_type: "image",
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      public_id: uploadedFile.public_id,
    };
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
    image: fileData,
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