import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken';

// this middleware used when we send token from frontend, so by this method verify the token that user is valid or not.
const getLoggedInUserDetailFromToken = (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization").replace("Bearer ", "");
        // With replace with get token with no space that's why we use replace. now no need to use split. 
        // Here we are using optional chaining(symbol ?)(syntax -> like this req.cookies?.accessToken); it means agr cookies mei kuch nhi hai it will return null instead to give error.
        
        if(!token) throw new ApiError(401, "Unauthorized request");

        // We use callback function so that we send the token expired error, we will get a new request for new access token.
        jwt.verify(token, process.env.SECRET_ACCESSTOKEN, function(err, decode){
            if(err){
                err = {
                    name : "TokenExpiredError",
                    message : "Jwt Token expired"
                }
                
                req.tokenExpiredError = err;
                return;
            }

            req.user = decode;
        });
    
        next();

    } catch (error) {
        throw new ApiError(500,  error.message);
    }
}   

export {getLoggedInUserDetailFromToken}