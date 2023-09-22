const express = require('express')

const router = express.Router()

const {
  getRoomfn,
  linkBtn,
  adminCreate,
  userSel,
  joinMeet,
  roomPeople,
} = require('../controllers/viewController')
const authController = require('../controllers/authController')

router.route('/linkedinSignup').get(linkBtn)
router.route('/AdminPage').get(authController.adminAccess, adminCreate)

router.use(authController.protect)
router.route('/userSelections').get(authController.oneTimeAccess, userSel)
router.route('/meetRandomPeople').get(joinMeet)
router.route('/getRoom').get(getRoomfn)
router.route(`/connectedPeople/:room`).get(roomPeople)

module.exports = router
