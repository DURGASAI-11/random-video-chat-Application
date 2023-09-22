const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    unique: [true, 'must unique category'],
    required: [true, 'The user must have a category'],
  },
})

const Category = mongoose.model('Category', categorySchema)

module.exports = { Category }
