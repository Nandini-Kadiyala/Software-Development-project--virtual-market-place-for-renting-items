import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import userModel from '../models/userModel.js';

const protectRoute = asyncHandler(async (req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decodedId = jwt.verify(token,process.env.JWT_SECRET);
            const currUser = await userModel.findById(decodedId.id).select('-password');
            if(!currUser){
                res.status(404);
                throw new Error("User not found");
            }
            req.user = currUser;
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Unable to login, wrong token/user not found");
        }
    }

    if(!token){
        res.status(401);
        throw new Error("Unable to login, no token");
    }
})

export default protectRoute;