const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
  country: {
    type: String,
    unique: [true, 'must unique country'],
    required: [true, 'The user must have a country'],
  },
})

const Country = mongoose.model('Country', countrySchema)

module.exports = { Country }
