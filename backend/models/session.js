const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: Date, default: Date.now },
  slides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slide' }]
});

module.exports = mongoose.model('Session', sessionSchema);
