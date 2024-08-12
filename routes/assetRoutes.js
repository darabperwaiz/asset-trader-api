import express from 'express'
import { auth } from "../middlewares/authMiddleware.js"
import { createAsset, getAssetById, getAssetsOnMarketplace, getUserAssets, publishAsset, updateAsset } from "../controllers/assetController.js"

const assetRoutes = express.Router()

assetRoutes.post('/assets', auth, createAsset)
assetRoutes.post('/assets/:id', auth, updateAsset)
assetRoutes.put('/assets/:id/publish', auth, publishAsset)
assetRoutes.get('/assets/:id', getAssetById)
assetRoutes.get('/users/:id/assets', getUserAssets)
assetRoutes.get('/marketplace/assets', getAssetsOnMarketplace)


export default assetRoutes