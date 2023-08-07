const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const { v4: uuidv4 } = require("../node_modules/uuid");
const jwtSecret = process.env.JWT_SECRET;

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next({
      message: "Please provide email and password",
      statusCode: 400,
    });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return next({
      message: "The email is not yet registered to an accout",
      statusCode: 400,
    });
  }

  const match = await user.checkPassword(password);

  if (!match) {
    return next({ message: "The password does not match", statusCode: 400 });
  }
  const token = user.getJwtToken();
  res.status(200).json({ success: true, token });
});

exports.signup = asyncHandler(async (req, res, next) => {
  const { username, password, email, fullname, phoneNumber } = req.body;
  const userId = uuidv4(); // Generate a new UUID

  console.log("Generated userId:", userId); // Add this line for debugging

  if (!username || !password || !email || !fullname) {
    return next({
      message: "Please provide all required fields (username, password, email, fullname)",
      statusCode: 400,
    });
  }

  // Validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next({
      message: "Invalid email format",
      statusCode: 400,
    });
  }

  try {
    // Check if the generated userId is already used
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      // If it's not unique, generate a new userId and try again
      return exports.signup(req, res, next);
    }

    // Check if the phoneNumber already exists
    if (phoneNumber) {
      const existingPhoneNumberUser = await User.findOne({ phoneNumber });
      if (existingPhoneNumberUser) {
        return next({
          message: "Phone number already exists",
          statusCode: 400,
        });
      }
    }

    // Use the generated userId when creating the user
    const user = await User.create({ username, password, email, fullname, phoneNumber, userId });
    const token = user.getJwtToken();
    res.status(201).json({ success: true, token });
  } catch (error) {
    // Handle any MongoDB validation errors
    if (error.name === "MongoError" && error.code === 11000) {
      return next({
        message: "Username, email, or phone number already exists",
        statusCode: 400,
      });
    }
    // Handle any other errors
    console.error(error); // Log the error for debugging purposes
    return next({ message: "Failed to create user", statusCode: 500 });
  }
});


exports.me = asyncHandler(async (req, res, next) => {
  const { avatar, username, fullname, email, _id, website, bio } = req.user;

  res
    .status(200)
    .json({
      success: true,
      data: { avatar, username, fullname, email, _id, website, bio },
    });
});


exports.updateNullUserId = async () => {
  try {
    const usersWithNullUserId = await User.find({ userId: null });

    for (const user of usersWithNullUserId) {
      const newUserId = uuidv4();
      user.userId = newUserId;
      await user.save();
    }

    console.log("Updated null userId for existing documents.");
  } catch (error) {
    console.error("Error updating null userId:", error);
  }
};

// Call this function to update existing documents with a null userId
exports.updateNullUserId();