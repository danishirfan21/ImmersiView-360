const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/immersiview');
    const existing = await User.findOne({ username: 'admin' });
    if (!existing) {
      const admin = new User({
        username: 'admin',
        password: 'password123',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created: admin / password123');
    } else {
      console.log('Admin user already exists');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
