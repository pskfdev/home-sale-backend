const express = require('express')
const router = express.Router()

//Middleware
const { authCheck } = require('../middleware/authCheck')

//Controller
const { addWishlist, listWishlist, removeWishlist } = require('../controllers/wishlist')


router.post('/wishlist', authCheck, addWishlist)
router.get('/wishlist', authCheck, listWishlist)
router.delete('/wishlist', authCheck, removeWishlist)


module.exports = router