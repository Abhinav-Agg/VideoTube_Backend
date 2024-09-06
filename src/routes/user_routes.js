import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/user_controller.js';
import upload from '../middlewares/uploadFile.js';
import { getLoggedInUserDetailFromToken } from '../middlewares/auth.js';

const router = express.Router();

// Standard Syntax for a route to call an api method with http method. Here we need to add upload(multer) middleware on this route. Like below we are adding that.
// here are some methods which are used with upload like fields(), array(), signle(), none(), any(). More Details in multer file middleware.
// SYntax -> router.router('nameofusedforanmethod').httpMethod(middleware(optional), controllerMethodName);
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
router.route('/logout').post(getLoggedInUserDetailFromToken, logoutUser);

export default router;