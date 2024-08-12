import express from 'express'
import { acceptPurchaseRequest, createRequest, denyPurchaseRequest, negotiate, usersPurchaseRequsts } from "../controllers/reqController.js"
import { auth } from "../middlewares/authMiddleware.js"


const requestRoutes = express.Router()

requestRoutes.post('/assets/:id/request', auth, createRequest)
requestRoutes.put('/requests/:id/negotiate', auth, negotiate)
requestRoutes.put('/requests/:id/accept', auth, acceptPurchaseRequest)
requestRoutes.put('/requests/:id/deny', auth, denyPurchaseRequest)
requestRoutes.get('/users/:id/requests', usersPurchaseRequsts)

export default requestRoutes

