// models/User.js
const mongoose = require('mongoose');
const validator = require('validator'); // Library to validate data
const bcrypt = require('bcryptjs'); // Library to hash passwords

// Define the rules (schema) for what a User document looks like
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'], // This field is mandatory
    trim: true // Removes extra spaces from the beginning and end
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true, // No two users can have the same email
    lowercase: true, // converts 'EMAIL@GMAIL.COM' to 'email@gmail.com'
    validate: [validator.isEmail, 'Please provide a valid email'] // Uses validator library to check format
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6, // Password must be at least 6 characters long
    select: false // This means when we fetch a user, the password won't be sent back by default (for security!)
  },
  savedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId, // This will store the unique IDs of events
      ref: 'Event' // This tells MongoDB that this ID connects to the "Event" model
    }
  ]
}, {
  timestamps: true // This automatically adds `createdAt` and `updatedAt` fields to every user
});

// MIDDLEWARE: This function runs just before a user is saved to the database.
userSchema.pre('save', async function(next) {
  // Only run this function if the password was actually modified (not on other updates)
  if (!this.isModified('password')) return next();

  // Hash the password with a "cost" of 12. Higher cost = more secure, but slower.
  this.password = await bcrypt.hash(this.password, 12);
  next(); // Move on to the next middleware or save the user
});

// INSTANCE METHOD: A function we can call on any user object to check their password.
// Example: user.correctPassword('password_attempt')
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  // bcrypt.compare compares the plain text attempt with the hashed password stored in the database.
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Create the Model from the Schema and export it
// This model is what we will use to create, read, update, and delete Users in our code.
const User = mongoose.model('User', userSchema);
module.exports = User;