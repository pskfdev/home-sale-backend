const express = require('express')
const router = express.Router()

/* Controller */
const { createCategory, listCategory, RemoveCategory, readCategory, updateCategory } = require('../controllers/category')


router.post('/category', createCategory)
router.get('/category', listCategory)
router.get('/category/:id', readCategory)
router.put('/category/:id', updateCategory)
router.delete('/category/:id', RemoveCategory)



module.exports = router