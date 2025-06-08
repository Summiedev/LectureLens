const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  slideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide', required: true },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true }
});

module.exports = mongoose.model('Quiz', quizSchema);
