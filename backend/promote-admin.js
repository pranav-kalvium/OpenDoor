const mongoose = require('mongoose');
require('dotenv').config();

async function promoteToAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = require('./models/User');
    
    // List all users and their roles
    const users = await User.find({}, 'username email role').lean();
    console.log('\nAll users:');
    users.forEach(u => console.log(`  ${u.username} (${u.email}) - role: ${u.role}`));

    if (users.length === 0) {
      console.log('No users found!');
      await mongoose.disconnect();
      return;
    }

    // Promote the first user (or all users for now) to admin
    const result = await User.updateMany({}, { $set: { role: 'admin' } });
    console.log(`\n✅ Promoted ${result.modifiedCount} user(s) to admin role`);

    // Verify
    const updated = await User.find({}, 'username email role').lean();
    console.log('\nUpdated users:');
    updated.forEach(u => console.log(`  ${u.username} (${u.email}) - role: ${u.role}`));

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

promoteToAdmin();
