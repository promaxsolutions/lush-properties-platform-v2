const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    ref: 'Project'
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense', 'transfer', 'loan']
  },
  amount: {
    type: Number,
    required: true
  },
  paidVia: {
    type: String,
    required: true,
    enum: ['bank-transfer', 'credit-card', 'cash', 'check']
  },
  reference: {
    type: String,
    required: true
  },
  receipt: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);