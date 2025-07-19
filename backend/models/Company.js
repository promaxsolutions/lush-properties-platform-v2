const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  abn: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  bankAccount: {
    type: String,
    required: true
  },
  parentCompany: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);