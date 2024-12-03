import express from 'express';
import { signup, login, deleteUser, updateProfilePicture } from '../controllers/userController.js';
import protectRoute from '../middlewares/authHandler.js';
import parser from '../utils/imageUpload.js';

const userRoutes = express.Router();

userRoutes.route('/signup').post(signup);
userRoutes.route('/login').post(login);
userRoutes.route('/upload').put(protectRoute,parser.single('image'),updateProfilePicture)
userRoutes.route('/delete').delete(protectRoute,deleteUser);

export default userRoutes;