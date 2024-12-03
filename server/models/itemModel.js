import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    sellerEmail: {
      type: String,
      required: true,
    },
    sellerPhone: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Car", "Bike", "Camera", "Other"], // Add categories as needed
    },
    price: {
      type: Number,
      required: true,
    },
    specs: {
      bhk: { type: Number },
      area: { type: Number },
      mileage: { type: Number },
      cameraResolution: { type: String },
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    nearbyFacilities: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;