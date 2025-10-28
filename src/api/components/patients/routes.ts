import  { Router} from 'express'
import { PatientController, PatientControllerImpl } from './controller'
import { PatientRepository } from './repository'
import { PatientServiceImpl } from './service'
import { authorize, authenticate } from '../../../middleware/authMiddleware'


const router = Router()
const repository = new PatientRepository()
const service = new PatientServiceImpl(repository)
const controller: PatientController = new PatientControllerImpl(service)

router.use(authenticate)
router.get('', authorize("USER"),  controller.getAllPatients.bind(controller))
router.post('/create',  controller.createPatient.bind(controller))
router.get('/:id',  controller.getPatientById.bind(controller))
router.delete('/:id',  controller.deletePatient.bind(controller))
router.put('/:id',  controller.updatePatient.bind(controller))



export default router