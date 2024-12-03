import User from '../models/userModel.js';
import Property from '../models/propertyModel.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { deleteFile } from '../utils/imageUpload.js';

const generateToken = (id) => {
    const token = jwt.sign({id},process.env.JWT_SECRET);
    return token;
}

// @desc    signup (create user)
// @route   POST /api/users
// @access  Public
export const signup = asyncHandler(async (req, res) => {

    const {firstName, lastName, email, password, phoneNumber} = req.body;

    if(!firstName || !email || !password || !phoneNumber){
        res.status(400);
        throw new Error('Please fill in all required fields');
    }

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error(`User with email ${email} already exists`);
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        firstName,
        lastName: lastName || '',
        email,
        password: encryptedPassword,
        phoneNumber,
        profilePicture: '',
        likedProperties: []
    });

    if(newUser){
        console.log('signup success');
        res.status(200).json({
            token: generateToken(newUser._id),
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            profilePicture: newUser.profilePicture,
            likedProperties: newUser.likedProperties
        });
    } else {
        res.status(400);
        throw new Error('Unable to create user');
    }
});

// @desc    login (authenticate user)
// @route   POST /api/users/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error('Please fill in all required fields');
    }

    const currUser = await User.findOne({email});
    if(currUser && (await bcrypt.compare(password, currUser.password))){
        console.log('login success');
        res.status(200).json({
            token: generateToken(currUser._id),
            firstName: currUser.firstName,
            lastName: currUser.lastName,
            email: currUser.email,
            phoneNumber: currUser.phoneNumber,
            profilePicture: currUser.profilePicture,
            likedProperties: currUser.likedProperties
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    delete user
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = asyncHandler(async (req, res) => {
    const userProperties = await Property.find({sellerEmail: req.user.email});

    for(let property of userProperties){
        await Property.findByIdAndDelete(property._id);
        await deleteFile(property.image);
    }

    const deletedUser = await User.findByIdAndDelete(req.user._id);
    await deleteFile(req.user.profilePicture);
    if(deletedUser){
        console.log('user deleted');
        res.status(200).json({message: 'User deleted successfully'});
    } else {
        res.status(400);
        throw new Error('Unable to delete user');
    }
});


// @desc    update user profilePicture
// @route   PUT /api/users/profilePicture
// @access  Private

export const updateProfilePicture = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    console.log(req.file.path);
    const uploadedUrl = req.file.path;

    const updatedUser = await User.findByIdAndUpdate(user._id, {profilePicture: uploadedUrl}, {new: true});

    res.status(200).json({
        token: generateToken(user._id),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        profilePicture: updatedUser.profilePicture,
    });
})