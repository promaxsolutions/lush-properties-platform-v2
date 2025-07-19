const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true
  },
  stage: {
    type: String,
    required: true,
    enum: ['planning', 'construction', 'completed', 'on-hold']
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  lenderTemplate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'pending', 'approved']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);