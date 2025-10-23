import  { Router} from 'express'
import { PatientController, PatientControllerImpl } from './controller'
import { PatientRepository } from './repository'
import { PatientServiceImpl } from './service'
import { authorize } from '../../../middleware/authMiddleware'


const router = Router()
const repository = new PatientRepository()
const service = new PatientServiceImpl(repository)
const controller: PatientController = new PatientControllerImpl(service)


router.get('', authorize("ADMIN"),  controller.getAllPatients.bind(controller))
router.post('/create',  controller.createPatient.bind(controller))
router.get('/:id',  controller.getPatientById.bind(controller))
router.delete('/:id',  controller.deletePatient.bind(controller))
router.put('/:id',  controller.updatePatient.bind(controller))



export default router