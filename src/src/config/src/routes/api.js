import express from 'express'
import { registerUser, getUsers } from '../controllers/userController.js'

const router = express.Router()

router.post('/register', registerUser)
router.get('/users', getUsers)
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
