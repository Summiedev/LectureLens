const mongoose = require('mongoose');

const quizResponseSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  studentUUID: { type: String, required: true },
  slideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide' },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  correct: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResponse', quizResponseSchema);
