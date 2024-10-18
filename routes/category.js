const express = require('express')
const router = express.Router()

/* Controller */
const { createCategory, listCategory, RemoveCategory } = require('../controllers/category')


router.post('/category', createCategory)
router.get('/category', listCategory)
router.delete('/category/:id', RemoveCategory)



module.exports = router