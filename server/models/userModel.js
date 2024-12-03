import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    likedProperties: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Property",
      default: [],
    },
    bookedProperties: [
      {
        propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
        from: { type: Date },
        to: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
