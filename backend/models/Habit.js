const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  completedDates: { type: [String], default: [] },
});

module.exports = mongoose.model('Habit', habitSchema);

