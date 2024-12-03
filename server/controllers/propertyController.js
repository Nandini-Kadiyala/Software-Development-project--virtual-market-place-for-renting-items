import AsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Property from "../models/propertyModel.js";
import User from "../models/userModel.js";
import { deleteFile } from "../utils/imageUpload.js";

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
  return token;
};

export const getProperties = AsyncHandler(async (req, res) => {
  const properties = await Property.find({});
  res.json(properties);
});

export const createProperty = AsyncHandler(async (req, res) => {
  const sellerEmail = req.user.email;
  const sellerPhone = req.user.phoneNumber;
  const { price, bhk, area, location, city, nearbyFacilities } = req.body;

  if (!price || !bhk || !area || !location || !city) {
    res.status(400);
    throw new Error("Please provide all necessary details");
  }

  const newProperty = await Property.create({
    sellerEmail,
    sellerPhone,
    price,
    bhk,
    area,
    location,
    city,
    image: "",
    likes: 0,
    nearbyFacilities: nearbyFacilities ? nearbyFacilities : [],
  });
  res.json(newProperty);
});

export const updateProperty = AsyncHandler(async (req, res) => {
  const propertyId = req.params.id;

  const property = await Property.findById(propertyId);

  if (property.sellerEmail !== req.user.email) {
    res.status(401);
    throw new Error("You are not authorized to update this property");
  }

  const { price, bhk, area, location, city, nearbyFacilities } = req.body;

  if (!price || !bhk || !area || !location || !city) {
    res.status(400);
    throw new Error("Please provide all the details");
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    {
      price,
      bhk,
      area,
      location,
      city,
      nearbyFacilities: nearbyFacilities ? nearbyFacilities : [],
    },
    { new: true }
  );

  res.json(updatedProperty);
});

export const uploadImage = AsyncHandler(async (req, res) => {
  const propertyId = req.params.id;
  const property = await Property.findById(propertyId);

  if (property.sellerEmail !== req.user.email) {
    res.status(401);
    throw new Error("You are not authorized to update this property");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const uploadedUrl = req.file.path;
  await deleteFile(property.image);
  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    { image: uploadedUrl },
    { new: true }
  );

  res.json(updatedProperty);
});

export const likeProperty = AsyncHandler(async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);
  const property = await Property.findById(propertyId);
  const liked = user.likedProperties;
  liked.push(propertyId);

  const updateUser = await User.findByIdAndUpdate(
    userId,
    {
      likedProperties: liked,
    },
    { new: true }
  );

  await Property.findByIdAndUpdate(propertyId, { likes: property.likes + 1 });

  res.status(200).json({
    token: generateToken(userId),
    firstName: updateUser.firstName,
    lastName: updateUser.lastName,
    email: updateUser.email,
    phoneNumber: updateUser.phoneNumber,
    profilePicture: updateUser.profilePicture,
    likedProperties: updateUser.likedProperties,
  });
});

export const dislikeProperty = AsyncHandler(async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);
  const property = await Property.findById(propertyId);
  const liked = user.likedProperties;
  const newLiked = liked.filter((id) => id != propertyId);

  const updateUser = await User.findByIdAndUpdate(
    userId,
    {
      likedProperties: newLiked,
    },
    { new: true }
  );

  let prevLikes = property.likes;
  if (prevLikes === 0) {
    await Property.findByIdAndUpdate(propertyId, { likes: prevLikes });
  } else {
    await Property.findByIdAndUpdate(propertyId, { likes: prevLikes - 1 });
  }

  res.status(200).json({
    token: generateToken(userId),
    firstName: updateUser.firstName,
    lastName: updateUser.lastName,
    email: updateUser.email,
    phoneNumber: updateUser.phoneNumber,
    profilePicture: updateUser.profilePicture,
    likedProperties: updateUser.likedProperties,
  });
});

export const deleteProperty = AsyncHandler(async (req, res) => {
  const propertyId = req.params.id;
  const property = await Property.findById(propertyId);

  if (property.sellerEmail !== req.user.email) {
    res.status(400);
    throw new Error("You are not authorized to delete this property");
  }

  await Property.findByIdAndDelete(propertyId);
  await deleteFile(property.image);
  res.json({ message: "Property deleted successfully" });
});

export const bookProperty = AsyncHandler(async (req, res) => {
  const propertyId = req.params.id;
  const { from, to } = req.body;
  const userId = req.user._id;

  if (!from || !to) {
    res.status(400);
    throw new Error("Please provide both 'from' and 'to' dates");
  }

  // Ensure the property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // Check if the user already booked the property
  const existingBooking = property.bookings.find(
    (booking) =>
      (new Date(from) >= new Date(booking.from) &&
        new Date(from) <= new Date(booking.to)) ||
      (new Date(to) >= new Date(booking.from) &&
        new Date(to) <= new Date(booking.to))
  );

  if (existingBooking) {
    res.status(400);
    throw new Error("This property is already booked for the selected dates");
  }

  // Add the booking to the property
  property.bookings.push({ userId, from, to });
  await property.save();

  // Optionally, you can save the booking in the User model as well
  const user = await User.findById(userId);
  user.bookedProperties.push({ propertyId, from, to });
  await user.save();

  res.status(200).json({
    message: "Booking successful",
    property,
  });
});
