const express = require('express')

const router = express.Router()
const adminCon = require('../controllers/adminController')

router.route('/adminCate').post(adminCon.categorySel)
router.route('/adminCoun').post(adminCon.countrySel)
router.route('/updateUserModel/:userid').patch(adminCon.updateUserDetails)
module.exports = router
