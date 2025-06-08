const mongoose = require('mongoose');

const attentionLogSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  studentUUID: { type: String, required: true },
  slideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide' },
  attentionScore: { type: Number, min: 0, max: 1 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AttentionLog', attentionLogSchema);
