import express from 'express';
import { 
    changePassword, 
    checkTokenAccess, 
    getCurrentUserDetails, 
    getUserChannelSubsProfile, 
    getWatchHistory, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails, 
    updateAvatar 
} from '../controllers/user_controller.js';
import upload from '../middlewares/uploadFile.js';
import { getLoggedInUserDetailFromToken } from '../middlewares/auth.js';

const router = express.Router();


// Standard Syntax -> router.router('nameofusedforanmethod').httpMethod(middleware(optional), controllerMethodName); Here upload(multer) things using as middlware.
// here are some methods which are used with upload like fields(), array(), signle(), none(), any(). More Details in multer file middleware / multer package.
router.route('/register').post(
    upload.fields([
        {
            name : "avatarImage",
            maxCount :  1
            /* here name is attribute of html which we add in html code at time of add field. Maxcount it means how many image will you add. */
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
);

router.route('/login').post(loginUser);

// Secured Routes
router.route('/logout').post(getLoggedInUserDetailFromToken, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/changePassword').post(getLoggedInUserDetailFromToken, changePassword);
router.route('/updateAccount').patch(getLoggedInUserDetailFromToken, updateAccountDetails);
router.route('/current-user').get(getLoggedInUserDetailFromToken, getCurrentUserDetails);

// Other routes
//router.route('/updateAvatar').post(getLoggedInUserDetailFromToken, upload.single("avatarImage"), updateAvatar); // explanation inside the method.
router.route('/updateAvatar').post(getLoggedInUserDetailFromToken, upload.fields([{name : "avatarImage" , maxCount : 1}]), updateAvatar);
router.route('/updateCover').post(getLoggedInUserDetailFromToken, upload.fields([{name : "coverImage" , maxCount : 1}]), updateAvatar);
router.route('/userChannelProfile/:username').get(getLoggedInUserDetailFromToken, getUserChannelSubsProfile);
router.route('/watchHistory').get(getLoggedInUserDetailFromToken, getWatchHistory);

// Test Api routes
router.route('/checkTokenUser').post(getLoggedInUserDetailFromToken, checkTokenAccess);   // This route is for testing purpose of middleware, when testing will complete, we remove this route.

export default router;