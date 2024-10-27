const express = require('express')
const router = express.Router()

//Middleware
const { authCheck, adminCheck } = require('../middleware/authCheck')

//Controller
const { listUser, readUser, changePasswordUser, removeUser, changeRoleUser, updateUser } = require('../controllers/user')


router.get('/user', authCheck, adminCheck, listUser)
router.get('/user/:id', authCheck, adminCheck, readUser)
router.put('/user/:id', authCheck, adminCheck, updateUser) /* update name and role */
router.delete('/user/:id', authCheck, adminCheck, removeUser)

router.put('/change-password/:id', authCheck, adminCheck, changePasswordUser) /* change-password */
router.put('/change-role/:id', authCheck, adminCheck, changeRoleUser)


module.exports = router