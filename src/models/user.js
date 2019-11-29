// jshint esversion: 8
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: "User"
  },

  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive number!");
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid!");
      }
    }
  },
  avatar: {
    type: Buffer
  },

  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [7, "Password too short"],
    validate(value) {
      if (validator.contains(value, "password")) {
        throw new Error("Password must not contain", value);
      }
    }
  }
}, {
  timestamps: true
});

// Setting up relationship

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

// Schema methods
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  try {
    const token = await jwt.sign({
        _id: user._id.toString()
      },
      process.env.JWT_SECRET
    );
    user.tokens = user.tokens.concat({
      token
    });
    await user.save();
    return token;
  } catch (error) {
    return new Error(error);
  }
};

userSchema.methods.toJSON = function () {
  const user = this;
  try {
    userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
  } catch (error) {
    return error;
  }
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({
    email: email
  });
  if (!user) {
    throw new Error("Uable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({
    owner: user._id
  });
});
const User = mongoose.model("User", userSchema);

module.exports = User;