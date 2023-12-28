import { Router } from 'express';
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, login, logout, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    );

userRouter.route('/login').post(login);
userRouter.route('/logout').post(verifyAuth,logout)
userRouter.route('/refresh-token').post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("/coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

export default userRouter;