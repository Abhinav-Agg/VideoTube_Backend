import { asyncHandler } from "../utils/asyncHandleWrapper.js";

const registerUser = asyncHandler(async(req,res) => {
    res.status(200).json({
        message : 'yes! its registeruser function starts working !!!'
    })
});


export {registerUser}