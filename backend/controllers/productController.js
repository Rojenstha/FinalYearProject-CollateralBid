const asyncHandler = require("express-async-handler")
const path = require("path")
const fs = require("fs")
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2
const Product = require("../models/productModel")


const createProduct = asyncHandler(async(req, res) => {
  console.log("File received:", req.file);
  const { title, description, price, category, height, lengthpic, width, mediumused, weigth } = req.body;
  const userId = req.user.id;

  console.log("CREATE PRODUCT BODY:", req.body);

  if (!title || !description || !price|| !category) {
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

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort("-createdAt").populate("user");

  res.json(products);
});
 
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user?.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Step 1: Delete image from Cloudinary
  if (product.image && product.image.public_id) {
    try {
      await cloudinary.uploader.destroy(product.image.public_id);
      console.log("Image deleted from Cloudinary");
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  }

  if (product.image && product.image.filePath && !product.image.filePath.startsWith("http")) {
    const localFilePath = path.join(__dirname, "..", product.image.filePath); // Fix path resolution

    fs.access(localFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("File does not exist:", localFilePath);
      } else {
        fs.unlink(localFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete local file:", unlinkErr);
          } else {
            console.log("Local file deleted successfully:", localFilePath);
          }
        });
      }
    });
  }

  await Product.findByIdAndDelete(id);
  res.status(200).json({ message: "Product deleted." });
});


const updateProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, height, lengthpic, width, mediumused, weigth } = req.body;
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  let fileData = {};
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bidding/Product",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image colud not be uploaded");
    }

    if (product.image && product.image.public_id) {
      try {
        await cloudinary.uploader.destroy(product.image.public_id);
      } catch (error) {
        console.error("Error deleting previous image from Cloudinary:", error);
      }
    }
    //step 1 :
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      public_id: uploadedFile.public_id,
    };
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      title,
      description,
      price,
      category,
      height,
      lengthpic,
      width,
      mediumused,
      weigth,
      image: Object.keys(fileData).length === 0 ? Product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedProduct);
});

const getAllProductsofUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const products = await Product.find({ user: userId }).sort("-createdAt").populate("user");

  res.json(products);
  // const productsWithPrices = await Promise.all(
  //   products.map(async (product) => {
  //     const latestBid = await BiddingProduct.findOne({ product: product._id }).sort("-createdAt");
  //     const biddingPrice = latestBid ? latestBid.price : product.price;
  //     return {
  //       ...product._doc,
  //       biddingPrice, // Adding the price field
  //     };
  //   })
  // );

  // res.status(200).json(productsWithPrices);

});

const verifyAndAddCommissionProductByAdmin = asyncHandler(async(req, res) => {

  const { commission } = req.body;
  const { id } = req.params;

  console.log("Received commission:", commission);
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.isVerify = true;
  product.commission = commission;

  await product.save();

  res.status(200).json({ message: "Product verified successfully", data: product });
});

const getAllProductsByAdmin = asyncHandler(async(req, res) => {
  // const products = await Product.find({}).sort("-createdAt").populate("user");

  // const productsWithPrices = await Promise.all(
  //   products.map(async (product) => {
  //     const latestBid = await BiddingProduct.findOne({ product: product._id }).sort("-createdAt");
  //     const biddingPrice = latestBid ? latestBid.price : product.price;
  //     return {
  //       ...product._doc,
  //       biddingPrice, // Adding the price field
  //     };
  //   })
  // );

  // res.status(200).json(productsWithPrices);

  const products = await Product.find({}).sort("-createdAt").populate("user");

  res.json(products);
});

const deleteProductsByAdmin = asyncHandler(async (req, res) => {
  const { productIds } = req.body;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.image && product.image.public_id) {
    try {
      await cloudinary.uploader.destroy(product.image.public_id);
      console.log("Image deleted from Cloudinary");
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  }

  if (product.image && product.image.filePath && !product.image.filePath.startsWith("http")) {
    const localFilePath = path.join(__dirname, "..", product.image.filePath); // Fix path resolution

    fs.access(localFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("File does not exist:", localFilePath);
      } else {
        fs.unlink(localFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete local file:", unlinkErr);
          } else {
            console.log("Local file deleted successfully:", localFilePath);
          }
        });
      }
    });
  }

  await Product.findByIdAndDelete(productIds);
  res.status(200).json({ message: "Product deleted." });
});

const getProduct = asyncHandler(async(req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("user");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(product);
});

const getAllSoldProducts = asyncHandler(async(req, res) => {
  

  const products = await Product.find({ isSoldOut: true }).sort("-createdAt").populate("user");

  res.json(products);
});

const test = asyncHandler(async(req, res) => {
  res.send("test")
});
 

module.exports={
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  getAllProductsofUser,
  getAllSoldProducts,
  verifyAndAddCommissionProductByAdmin,
  getAllProductsByAdmin,
  deleteProductsByAdmin,
};