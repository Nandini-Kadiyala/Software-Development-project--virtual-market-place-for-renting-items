import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    sellerEmail: {
      type: String,
      required: true,
    },
    sellerPhone: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bhk: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
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
    bookings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        from: { type: Date, required: true },
        to: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
