const express = require('express')
const router = express.Router()

/* Controller */
const { createAssets, listAssets, readAssets, removeAssets, updateAssets, createImage, removeImage } = require('../controllers/assets')


router.post('/assets', createAssets)
router.get('/assets', listAssets)
router.get('/assets/:id', readAssets)
router.put('/assets/:id', updateAssets)
router.delete('/assets/:id', removeAssets)

//Router Image
router.post('/image', createImage)
router.delete('/image/:public_id', removeImage)



module.exports = router