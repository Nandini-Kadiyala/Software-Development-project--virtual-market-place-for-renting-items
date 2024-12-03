import express from "express";
import {
  createItem,
  deleteItem,
  dislikeItem,
  getItems,
  likeItem,
  updateItem,
  uploadImage,
} from "../controllers/itemController.js"; // Updated controller name
import protectRoute from "../middlewares/authHandler.js";
import parser from "../utils/imageUpload.js";

const itemRoutes = express.Router();

itemRoutes.route("/").get(getItems);
itemRoutes.route("/create").post(protectRoute, createItem);
itemRoutes.route("/:id").put(protectRoute, updateItem);
itemRoutes
  .route("/uploadimage/:id")
  .put(protectRoute, parser.single("image"), uploadImage);
itemRoutes.route("/like/:id").put(protectRoute, likeItem);
itemRoutes.route("/dislike/:id").put(protectRoute, dislikeItem);
itemRoutes.route("/:id").delete(protectRoute, deleteItem);

export default itemRoutes;