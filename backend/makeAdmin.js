require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOneAndUpdate(
      { username: 'testuser123' },
      { role: 'admin' },
      { new: true }
    );
    console.log('User updated:', user.username, 'Role:', user.role);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

makeAdmin();
