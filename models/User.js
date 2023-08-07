const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: [true, "Please enter your username"],
    trim: true,
    index: true,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password should be at least minimum of 6 characters"],
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true, // Make sure 'sparse' is set to true
  },
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/douy56nkf/image/upload/v1594060920/defaults/txxeacnh3vanuhsemfc8.png",
  },
  bio: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getJwtToken = function () {
  // Make sure to import and configure dotenv if needed
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error("JWT_SECRET is missing. Make sure to set the environment variable.");
  }

  return jwt.sign({ id: this._id }, secretKey, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
UserSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.virtual("followersCount").get(function () {
  return this.followers.length;
});

UserSchema.virtual("followingCount").get(function () {
  return this.following.length;
});

UserSchema.virtual("postCount").get(function () {
  return this.posts.length;
});

module.exports = mongoose.model("User", UserSchema);
