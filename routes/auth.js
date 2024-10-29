const express = require('express')
const router = express.Router()

/* Controller */
const { register, login, currentUser, currentAdmin } = require('../controllers/auth')
/* Middleware */
const { authCheck, adminCheck } = require('../middleware/authCheck')


router.post('/register', register)
router.post('/login', login)
router.post('/current-user', authCheck, currentUser)
router.post('/current-admin', authCheck, adminCheck, currentAdmin)



module.exports = router