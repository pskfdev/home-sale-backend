const express = require('express')
const router = express.Router()

/* Controller */
const { createAssets, listAssets, readAssets, removeAssets, updateAssets } = require('../controllers/assets')


router.post('/product', createAssets)
router.get('/product', listAssets)
router.get('/product/:id', readAssets)
router.put('/product/:id', updateAssets)
router.delete('/product/:id', removeAssets)



module.exports = router