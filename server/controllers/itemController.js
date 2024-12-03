import AsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Item from "../models/itemModel.js"; // Updated model name
import User from "../models/userModel.js";
import { deleteFile } from "../utils/imageUpload.js";

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
  return token;
};

// @desc    Get all items
// @route   GET /api/items
// @access  Public
export const getItems = AsyncHandler(async (req, res) => {
  const items = await Item.find({});
  res.json(items);
});

// @desc    Post an item
// @route   POST /api/items/create
// @access  Private
export const createItem = AsyncHandler(async (req, res) => {
  const sellerEmail = req.user.email;
  const sellerPhone = req.user.phoneNumber;
  const { price, category, specs, location, city, nearbyFacilities, features } =
    req.body;

  if (!price || !category || !location || !city) {
    res.status(400);
    throw new Error("Please provide all necessary details");
  }

  // Validate specs based on category
  if (category === "Car" && !specs.mileage) {
    res.status(400);
    throw new Error("Mileage is required for cars");
  }
  if (category === "Bike" && !specs.mileage) {
    res.status(400);
    throw new Error("Mileage is required for bikes");
  }
  if (category === "Camera" && !specs.cameraResolution) {
    res.status(400);
    throw new Error("Camera resolution is required for cameras");
  }

  const newItem = await Item.create({
    sellerEmail,
    sellerPhone,
    category,
    price,
    specs,
    location,
    city,
    image: "",
    likes: 0,
    nearbyFacilities: nearbyFacilities || [],
    features: features || [],
  });
  res.json(newItem);
});

export const updateItem = AsyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const item = await Item.findById(itemId);

  if (item.sellerEmail !== req.user.email) {
    res.status(401);
    throw new Error("You are not authorized to update this item");
  }

  const { price, category, specs, location, city, nearbyFacilities, features } =
    req.body;

  if (!price || !category || !location || !city) {
    res.status(400);
    throw new Error("Please provide all the details");
  }

  // Validate specs based on category
  if (category === "Car" && !specs.mileage) {
    res.status(400);
    throw new Error("Mileage is required for cars");
  }
  if (category === "Bike" && !specs.mileage) {
    res.status(400);
    throw new Error("Mileage is required for bikes");
  }
  if (category === "Camera" && !specs.cameraResolution) {
    res.status(400);
    throw new Error("Camera resolution is required for cameras");
  }

  const updatedItem = await Item.findByIdAndUpdate(
    itemId,
    {
      price,
      category,
      specs,
      location,
      city,
      nearbyFacilities: nearbyFacilities || [],
      features: features || [],
    },
    { new: true }
  );

  res.json(updatedItem);
});

export const uploadImage = AsyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const item = await Item.findById(itemId);

  if (item.sellerEmail !== req.user.email) {
    res.status(401);
    throw new Error("You are not authorized to update this item");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const uploadedUrl = req.file.path;
  await deleteFile(item.image);
  const updatedItem = await Item.findByIdAndUpdate(
    itemId,
    { image: uploadedUrl },
    { new: true }
  );

  res.json(updatedItem);
});

export const likeItem = AsyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);
  const item = await Item.findById(itemId);
  const liked = user.likedItems;
  liked.push(itemId);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { likedItems: liked },
    { new: true }
  );

  await Item.findByIdAndUpdate(itemId, { likes: item.likes + 1 });

  res.status(200).json({
    token: generateToken(userId),
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    phoneNumber: updatedUser.phoneNumber,
    profilePicture: updatedUser.profilePicture,
    likedItems: updatedUser.likedItems,
  });
});

export const dislikeItem = AsyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);
  const item = await Item.findById(itemId);
  const liked = user.likedItems;
  const newLiked = liked.filter((id) => id != itemId);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { likedItems: newLiked },
    { new: true }
  );

  let prevLikes = item.likes;
  const updatedLikes = prevLikes === 0 ? prevLikes : prevLikes - 1;
  await Item.findByIdAndUpdate(itemId, { likes: updatedLikes });

  res.status(200).json({
    token: generateToken(userId),
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    phoneNumber: updatedUser.phoneNumber,
    profilePicture: updatedUser.profilePicture,
    likedItems: updatedUser.likedItems,
  });
});

export const deleteItem = AsyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const item = await Item.findById(itemId);

  if (item.sellerEmail !== req.user.email) {
    res.status(400);
    throw new Error("You are not authorized to delete this item");
  }

  await Item.findByIdAndDelete(itemId);
  await deleteFile(item.image);
  res.json({ message: "Item deleted successfully" });
});
