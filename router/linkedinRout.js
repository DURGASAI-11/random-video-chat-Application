const express = require('express')

const router = express.Router()
const linkedCon = require('../controllers/linkedinController')

router.route('/').get(linkedCon.getLoginPage)
router.route('/callback').get(linkedCon.linkedinCallback)
module.exports = router
