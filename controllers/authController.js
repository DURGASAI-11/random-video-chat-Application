const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const { User } = require('./../models/userModel')

exports.protect = async (err, req, res, next) => {
  // 1) Get the token and check if it's there

  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return res.status(401).render('error', { errorMessage: 'Unauthorized' })
  }

  // 2) Validate the token (verification)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const currentUser = await User.findById(decoded.user._id)
  if (!currentUser) {
    return res.status(404).render('error', { errorMessage: 'User not found' })
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  res.locals.user = currentUser
  next()
}

exports.oneTimeAccess = async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return res.status(401).render('error', { errorMessage: 'Unauthorized' })
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  const currentUser = await User.findById(decoded.user._id)

  if (currentUser.country) {
    return res
      .status(400)
      .render('error', { errorMessage: 'User dont have access multiple times' })
  }

  next()
}

exports.adminAccess = async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return res.status(401).render('error', { errorMessage: 'Unauthorized' })
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  const currentUser = await User.findById(decoded.user._id)
  if (!currentUser) {
    return res.status(403).render('error', { errorMessage: 'Unauthorized' })
  }
  if (decoded.user.role !== 'admin') {
    return res.status(403).render('error', { errorMessage: 'Unauthorized' })
  }

  next()
}
