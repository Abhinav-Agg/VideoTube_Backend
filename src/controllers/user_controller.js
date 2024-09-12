import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandleWrapper.js";
import { Users } from "../models/user_model.js"
import { uploadOnCloudinary } from "../service/CloudinaryServcie.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessandRefreshToken } from "../utils/commonMethod.js";
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async (req, res) => {
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
    const { fullName, email, username, password } = req.body;

    // add validation for getting data.
    // By this we can check for each field what we add and get error by this not requried to or & add operators for check each just mentioned in array and it will do.
    if ([fullName, email, username, password].some((field) => field === "")) {
        throw new ApiError(400, "All fields are required");
    }

    //check if user exists or not.
    const existingUser = await Users.findOne({
        $or: [{ Email: email }, { Username: username }]
    });

    if (existingUser) throw new ApiError(409, "User is already existed with this email");

    // Check for avatarImage and coverImage and add validation.
    // req.files -> using for uploading images and other files to get details.
    const avatarImageLocalPath = req.files.avatarImage[0].path;

    if (!avatarImageLocalPath) throw new ApiError(400, "Please upload avatar");

    // we add this condition beacuse coverImage is not mandatory if user not add it, it will given error. By this we handle error.
    let coverImageLocalPath = (!(req.files && req.files.coverImage)) ? "" : req.files.coverImage[0].path;

    // upload these image in cloudinary.
    const uploadAvatarImageResult = await uploadOnCloudinary(avatarImageLocalPath);

    let uploadCoverImageResult = '';

    if(coverImageLocalPath !== ''){
        uploadCoverImageResult = await uploadOnCloudinary(coverImageLocalPath);
    }

    let createdUser = await Users.create({
        FullName: fullName,
        Username: username,
        Email: email,
        Password: password,
        Avatar: uploadAvatarImageResult.url,
        CoverImage: uploadCoverImageResult === '' ? uploadCoverImageResult : uploadCoverImageResult.url
    });

    let resData = await Users.findById(createdUser._id).select("-Password -RefreshToken");

    return res.json(
        new ApiResponse(201, resData)
    );
});

const loginUser = asyncHandler(async (req, res) => {
    // Steps what will need to do.
    /*
    1. We fetch the details of user on the basis of req body.
    2. we will validate the details of user who requested.
    3. if user valid(its valid on the basis of password and details matched), will generate the access token for user.
    4. send token in secure cookies
    5. sedn the response.
    */

    const { email, username, password } = req.body;

    if (email === '' || username === '') throw new ApiError(400, "Please add atleast email or username");

    const userDetails = await Users.findOne({
        $or: [{ Email: email }, { Username: username }]
    });

    // check user credentails valid or not. And what methods we have created its worked with the variable in which we store the details of users.
    const isUserValid = await userDetails.isValidPassword(password);

    if (!isUserValid) throw new ApiError(400, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(userDetails);

    // By select method and use this syntax it will remove the columns. Remember add same name of column which we add in model.
    const loggedInUser = await Users.findById(userDetails._id).select("-Password -RefreshToken"); 
    
    // here options means -> we secure the cookie which means no one change the cookie from browser. Its handled by only from server.
    const options = {
        httpOnly : true,
        secure : true
    }

    // By below we set the cookie from server.
    res.status(200)
    .cookie("accessToken" , accessToken, options)
    .cookie("refreshToken" , refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                loggedInUser,
                AccessToken : accessToken,
                RefreshToken : refreshToken
            },
            "User Logged In successfully"
        )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    // Steps
    /*
    1. Here we get data from req but in logout we did not send any data, so we use token and we send that token in req.
    2. If we set the cookie from server, which means we need to remove at time of logout that's why we create the api endpoint for logout. 
    */
   
    await Users.findByIdAndUpdate(req.user._id, 
        {
            $set : {
                RefreshToken  : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
});

// This Api used when access token expired so this api will hit from frontend when it get response that access token exipred. 
// In this we send new access, refresh token on the basis if incoming refresh token will match with user's refresh token in db. then we generate new tokens.
// This Api hit from frontend when system returns error -> jwt expired and status code on this basis frontend hit this API.
const refreshAccessToken = asyncHandler(async (req,res) => {
    let incomingRefreshToken = req.cookies.refreshToken;  // here , we get refresh token.

    if(!incomingRefreshToken) throw new ApiError(401, "Invalid Token");

    try {
        let decodeToken = jwt.verify(incomingRefreshToken, process.env.SECRET_REFRESHTOKEN);
    
        let userDetails = await Users.findById(decodeToken._id);
    
        // We add this condition because if any person send suspecious token to enter in sys. but our system check the user in db, if not then we send the error instead to create new token.
        if(!userDetails) throw new ApiError(401, "Invalid Token");
    
        // Now, we check the incoming refresh token with user's refresh token.
        if(incomingRefreshToken !== userDetails.RefreshToken) throw new ApiError(401, "Invalid Authorization");
    
        // if matched we re-generate the token.
        let {accessToken, refreshToken} = await generateAccessandRefreshToken(userDetails);
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        res.status(200)
        .cookie("accessToken" , accessToken, options)
        .cookie("refreshToken" , refreshToken, options)
        .json(
            new ApiResponse(200, {}, "User token refreshed")
        )

    } catch (err) {
        throw new ApiError(500, err.message);
    }

});


// This api used for only testing purpose of middleware.
const checkTokenAccess = asyncHandler(async(req,res) => {
    let {user, tokenExpiredError} = req;
    
    if(user){
        res.status(200).send(user);
    }

    if(tokenExpiredError){
        res.status(401).json(req.tokenExpiredError);
    }
})


export { registerUser, loginUser, logoutUser, refreshAccessToken, checkTokenAccess }