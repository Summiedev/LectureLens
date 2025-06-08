const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  imageUrl: { type: String, required: true },
  slideIndex: { type: Number, required: true },
  slideText: { type: String },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }]
});

module.exports = mongoose.model('Slide', slideSchema);
