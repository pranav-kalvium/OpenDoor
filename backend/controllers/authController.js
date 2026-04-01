const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email or username'
      });
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const user = new User({ username, email, password, verificationToken });
    await user.save();

    // Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
    
    // In production, configure with real SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: 'test@ethereal.email', pass: 'testpass' }
    });

    try {
      console.log('VERIFY EMAIL URL:', verifyUrl);
      // await transporter.sendMail({ ... }) // Normally send the email here
    } catch(err) {
      console.error('Email send failed', err);
    }

    // Generate login token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('savedEvents');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, course, semester, interests, skills, github, linkedin } = req.body;
    
    // Support either URL string (legacy) or an uploaded file path
    let avatarUrl = req.body.avatar;
    if (req.file) {
      avatarUrl = `${process.env.VITE_API_BASE_URL ? process.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:5000'}/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        'profile.firstName': firstName,
        'profile.lastName': lastName,
        ...(avatarUrl && { 'profile.avatar': avatarUrl }),
        'profile.bio': bio,
        'profile.course': course,
        'profile.semester': semester,
        'profile.interests': interests || [],
        'profile.skills': skills || [],
        'profile.github': github,
        'profile.linkedin': linkedin,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    console.log('RESET URL:', resetUrl);
    res.status(200).json({ success: true, message: 'Token generated (check server console for dev)' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email successfully verified' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }

    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};