const { Category } = require('../models/catergoryModel')
const { Country } = require('../models/countryModel')
const { User } = require('../models/userModel')

module.exports.categorySel = async (req, res) => {
  // console.log(req.body)
  let { category } = req.body
  category = category.toUpperCase()
  const response = await Category.create({
    category: category,
  })
  res.status(200).json({ status: 'success' })
}
module.exports.countrySel = async (req, res) => {
  let { country } = req.body
  country = country.toUpperCase()
  const response = await Country.create({
    country: country,
  })
  res.status(200).json({ status: 'success' })
}

module.exports.updateUserDetails = async (req, res) => {
  const { userid } = req.params
  const { category, country } = req.body
  await User.findByIdAndUpdate(
    { _id: userid },
    { category: category, country: country },
    { new: true, runValidators: true },
  )
  res.status(200).json({ status: 'success' })
}
