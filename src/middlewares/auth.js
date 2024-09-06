import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken';

// this middleware used when we send token from frontend, so by this method verify the token that user is valid or not.
const getLoggedInUserDetailFromToken = (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // With replace with get token with no space that's why we use replace. now no need to use split. 
        // Here we are using optional chaining(symbol ?)(syntax -> like this req.cookies?.accessToken); it means agr cookies mei kuch nhi hai it will return null instead to give error.
        
        if(!token) throw new ApiError(401, "Unauthorized request");
    
        let decodeToken = jwt.verify(token, process.env.SECRET_ACCESSTOKEN);
    
        req.user = decodeToken;
    
        next();

    } catch (error) {
        throw new ApiError(500, "Invalid Access Token");
    }
}   

export {getLoggedInUserDetailFromToken}