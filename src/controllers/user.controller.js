import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErorr.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user detail from frontend
  //validation user detail
  //check if user already exists: username, email
  //check for images , check for avtar
  //upload them on cloudinary, avtar
  //create user object - create entry in db
  // remove passowrd and refresh token from response
  //check for  user creation
  //return response

  const { fullName, username, email, password } = req.body;
  console.log("email", email);
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists with this username or email");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath || !coverLocalPath) {
    throw new ApiError(400, "All fields are required");
  }

  //upload them on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar");
  }
  if (!coverImage) {
    throw new ApiError(400, "Failed to upload cover image");
  }

  //create user object - create entry in db
  const user = User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json({
    newUser: new ApiResponse(200, createdUser, "User registered successfully"),
  });
});

export { registerUser };
