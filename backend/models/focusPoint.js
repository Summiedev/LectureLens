const mongoose = require('mongoose');

const focusPointSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  studentUUID: { type: String, required: true },
  points: { type: Number, default: 10 },
  history: [{
    type: {
      type: String, 
      required: true
    },
    delta: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('FocusPoint', focusPointSchema);
