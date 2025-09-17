// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// A function to create a JSON Web Token (JWT) for a user
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // Token expires in 90 days
  });
};

// CONTROLLER 1: Sign up a new user
exports.signup = async (req, res) => {
  try {
    // 1. Create a new user based on the data from the request body (req.body)
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // 2. Remove the password from the output for security (even though it's hashed)
    newUser.password = undefined;

    // 3. Create a JWT token for the new user
    const token = signToken(newUser._id);

    // 4. Send success response with the token and user data
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    // 5. Catch any errors (like duplicate email) and send an error message
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// CONTROLLER 2: Log in an existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist in the request
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!',
      });
    }

    // 2) Find the user in the database AND select the password field (which is usually hidden)
    const user = await User.findOne({ email }).select('+password');

    // 3) Check if the user exists AND if the provided password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    // 4) If everything is ok, create a token and send it to the client
    const token = signToken(user._id);
    user.password = undefined; // Don't send the password back

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};