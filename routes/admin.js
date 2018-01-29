import express from 'express'
import Admin from '../controller/admin/admin'
const router = express.Router()

router.post('/login', Admin.login)
router.get('/info', Admin.getAdminInfo)
router.get('/signout', Admin.signout);

export default router