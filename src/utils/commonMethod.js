import { ApiError } from "./ApiError.js";

const generateAccessandRefreshToken = async (userDetails) => {
    try{
        const accessToken = userDetails.generateAccessToken();
        const refreshToken = userDetails.generateRefreshToken();
        
        userDetails.RefreshToken = refreshToken;
        
        await userDetails.save({validateBeforeSave: false});
        
        return {accessToken, refreshToken};   
    }
    catch(err){
        throw new ApiError(500, err.message);
    }
}

export {generateAccessandRefreshToken};