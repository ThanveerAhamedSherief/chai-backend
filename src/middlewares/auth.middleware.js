import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { User } from "../models/user.model.js";

export const verifyAuth = asyncHandler(async (req, res, next) => {
    try {
        let token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ',"");
        if(!token) {
            throw new ApiError(401, " unauthorized user")
        };
        console.log('coookieee==>', token);
        let decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(500,error?.message, " Error in authentication..!")
    }
});