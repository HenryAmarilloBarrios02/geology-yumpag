import express from 'express'

import { getAllListTrip, createListTrips } from '../controllers/data.controller.js'

const router = express.Router()

router.get('/geology', getAllListTrip)

router.post('/geology', createListTrips)

export default router