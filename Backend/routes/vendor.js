const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const vendorController = require('../controllers/vendorController')

router.get('/verify-token',vendorController.verifyToken)

router.post('/register',vendorController.registerVendor)

router.post('/login',vendorController.loginVendor)

router.get('/vendor-details', vendorController.getVendorDetails)

// router.get('/dashboard', auth, (req, res) => {
//     res.json({
//         message: "Welcome to dashboard",
//         user: req.user
//     })
// })

module.exports = router