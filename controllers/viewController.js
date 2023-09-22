const { Category } = require('../models/catergoryModel')
const { Country } = require('../models/countryModel')
const { User } = require('../models/userModel')
const { v4: uuidV4 } = require('uuid')

const linkBtn = async (req, res) => {
  res.status(200).render('linkedInRegis')
}
const userSel = async (req, res) => {
  const categories = await Category.find()
  const countries = await Country.find()
  res.status(200).render('userSelect', { categories, countries })
}
const adminCreate = async (req, res) => {
  res.status(200).render('admin')
}
const joinMeet = async (req, res) => {
  if (req.user) {
    res.status(200).render('joinNow', { joinUser: req.user._id })
  } else {
    res.status(400).render('error', { errorMessage: 'Unauthorized' })
  }
}
const roomPeople = async (req, res) => {
  if (req.user) {
    res
      .status(200)
      .render('room', { roomId: req.params.room, joinUser: req.user._id })
  } else {
    res.status(400).render('error', { errorMessage: 'Unauthorized' })
  }
}
var urlCall = undefined
module.exports = {
  getRoomfn: async (req, res) => {
    if (urlCall == undefined) {
      urlCall = `http://localhost:3000/api/v1/views/connectedPeople/${uuidV4()}`
      console.log(req.user.name + ' ' + 'joined the call')
      res.redirect(urlCall)
    } else {
      console.log(req.user.name + ' ' + 'joined the call')
      res.redirect(urlCall)
    }
  },
  roomPeople,
  joinMeet,
  adminCreate,
  userSel,
  linkBtn,
}
