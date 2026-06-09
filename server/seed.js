const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, default: 'user' }, isVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eduflow');
    console.log('Connected to MongoDB');

    // Create admin
    const hash = await bcrypt.hash('admin123', 12);
    await User.findOneAndUpdate(
      { email: 'admin@eduflow.com' },
      { name: 'Admin User', email: 'admin@eduflow.com', password: hash, role: 'admin', isVerified: true },
      { upsert: true }
    );
    console.log('✓ Admin created: admin@eduflow.com / admin123');

    // Create demo user
    const hash2 = await bcrypt.hash('user123', 12);
    await User.findOneAndUpdate(
      { email: 'demo@eduflow.com' },
      { name: 'Demo User', email: 'demo@eduflow.com', password: hash2, role: 'user', isVerified: true },
      { upsert: true }
    );
    console.log('✓ Demo user: demo@eduflow.com / user123');
    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

seed();
