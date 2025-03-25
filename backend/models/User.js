const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  streak: { type: Number, default: 1 }, // Streak count
  lastLoginDate: { type: Date, default: null }, // Track last login date
  subscription: { type: Object, default: null }
});
module.exports = mongoose.model('User', userSchema);

