const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  linkedinId: {
    type: String,
    required: [true, 'The user must have a sub'],
  },
  name: {
    type: String,
    required: [true, 'The user must have a companyID'],
  },
  email: {
    type: String,
    required: [true, 'The user must have a emailId'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  category: {
    type: String,
  },
  country: {
    type: String,
  },
})

const User = mongoose.model('User', userSchema)

module.exports = { User }
