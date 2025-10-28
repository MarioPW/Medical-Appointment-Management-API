import  { Router } from 'express'
import doctorRoutes from './components/doctors/routes'
import citaRoutes from './components/appointments/routes'
import pacienteRoutes from './components/patients/routes'
import { authenticate }  from '../middleware/authMiddleware'


const router = Router()

router.use(authenticate)  // Apply authentication middleware globally

router.use('/doctors', doctorRoutes)
router.use('/appointments', citaRoutes)
router.use('/patients', pacienteRoutes)

export default router