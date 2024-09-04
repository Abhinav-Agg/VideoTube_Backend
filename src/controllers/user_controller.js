import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandleWrapper.js";
import {Users} from "../models/user_model.js"
import { uploadOnCloudinary } from "../service/CloudinaryServcie.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res) => {
    /*
    Steps to build logic:-
    -> get user details from frontend. if no backend then give details in postman/thunderclient.
    -> add validation from backend -> that details not to be empty and we add validation in backend for a save purpose.
    -> check if user already exist with email id / username.
    -> check for images , check for avatar means add validation.
    -> upload them to cloudinary, and check in cloudinary that avatar has been uploaded or not.
    -> create user object for data which we received from user and add create code pass that obj in db..
    -> send the response for user creation or not, if created, remove password and refresh token fields from response.
    */

    // get user details from frontend.
    const {fullName, email, username, password} = req.body;

    // add validation for getting data.
    // By this we can check for each field what we add and get error by this not requried to or & add operators for check each just mentioned in array and it will do.
    if([fullName, email, username, password].some((field) => field === "")){
        throw new ApiError(400, "All fields are required");
    }

    //check if user exists or not.
    const existingUser = await Users.findOne({
        $or : [{email}, {username}]
    });
    console.log(existingUser);
    
    if(existingUser) throw new ApiError(409, "User is already existed with this email");
    
    // Check for avatarImage and coverImage and add validation.
    // req.files -> using for uploading images and other files to get details.
    const avatarImageLocalPath = req.files.avatarImage[0].path;

    const coverImageLocalPath = req.files.coverImage[0].path;

    if(!avatarImageLocalPath) throw new ApiError(400, "Please upload avatar");

    if(!coverImageLocalPath) throw new ApiError(400, "Please upload cover image");

    // upload these image in cloudinary.
    const uploadAvatarImageResult = await uploadOnCloudinary(avatarImageLocalPath);
    const uploadCoverImageResult = await uploadOnCloudinary(coverImageLocalPath);

    let createdUser = await Users.create({
        FullName : fullName,
        Username : username,
        Email : email,
        Password : password,
        Avatar : uploadAvatarImageResult.url,
        CoverImage : uploadCoverImageResult.url
    });

    let resData = await Users.findById(createdUser._id).select("-Password -RefreshToken");

    return res.json(
        new ApiResponse(201, resData)
    )
});


export {registerUser}