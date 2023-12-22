import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
 import { uploadOnCloudinary } from "../utils/cloudinary.js";

// const registerUser = asyncHandler( async (req, res) => {

//     const { username, email, fullName, password } = req.body;

//     if([username, fullName, email, fullName, password].some((field) => field?.trim() === "")){

//         throw new ApiError(400, " All fields are required..!")
//     }
// console.log('insisiisisisi');
//     let existedUser =  await User.findOne({
//         $or:[{email},{username}]
//     });

//     if(existedUser) {
//         throw new ApiError(409, "User Email or UserName already exists..!")
//     };

//     let avatarLocalPath = req.files?.avatar[0]?.path;
//     let coverImagePath = req.files?.avatar[0]?.path;
//     if(!avatarLocalPath) {
//         throw new ApiError(400, "Avatar is required..!")
//     }
//     console.log(avatarLocalPath)
//     let avatar = await uploadOnCloudinary(avatarLocalPath);
//     let coverImage = await uploadOnCloudinary(coverImagePath);

//    let user = await User.create({
//         username: username.toLowerCase(),
//         fullName,
//         email,
//         avatar: avatar.url,
//         coverImage: coverImage?.url || "",
//         password
//     });

//     let createdUser =  await User.findById(user._id).select('-password -refreshToken');
//     if(!createdUser) {
//         throw new ApiError(500, "Something went while registering the user!")
//     };

//     res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"))

//     // res.status(200).json({
//     //     status: 'Ok'
//     // })

// });
const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    console.log(req.files)
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    let coverImage;
    if(coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

export { registerUser };