import { Request, Response } from 'express'
import { PatientService } from './service'
import logger from '../../../utils/logger'
import { CustomError } from '../../../utils/customErrors'
import { createPatientSchema } from "./validations/patient.validation"


export interface PatientController {
    getAllPatients(req: Request, res: Response): void
    createPatient(req: Request, res: Response): void  
    getPatientById(req: Request, res: Response): void 
    updatePatient(req: Request, res: Response): void   
    deletePatient(req: Request, res: Response): void  
}

export class PatientControllerImpl implements PatientController {
    private  patientService:  PatientService
    
    constructor ( patientService: PatientService ){
        this.patientService = patientService
    }
    public  async getAllPatients(req: Request, res: Response): Promise<void> {
        try {
            const patients = await this.patientService.getAllPatients()
            res.status(200).json(patients)
            
        } catch (error) {
            res.status(400).json({message: "Error getting all patients"})
        }
    }
    public  createPatient (req: Request, res: Response): void {

        const { error, value } = createPatientSchema.validate(req.body)
        if (error){
            res.status(400).json({message: error.details[0].message})
        } else {
            this.patientService.createPatient(value)
            .then(
                (patient) => {
                    res.status(201).json(patient)
                    
                },
                (error) => {
                    logger.error(error)
                    if (error instanceof CustomError){
                        res.status(400).json({
                            error_name: error.name,
                            message: "Failed Creating a patient in controler"
                        })
                    } else {
                        res.status(400).json({
                            message: "Internal Server Error"
                        })
                    }
                }
            )
        }
    }

    public async getPatientById (req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            if (isNaN(id)){
                throw new Error("Id must be a number") 
            }
            const patient =  await this.patientService.getPatientById(id)
            if (patient) {
                res.status(200).json(patient)
            } else {
                throw new CustomError ('RecordNotFoundError', 'Record has not found yet', 'patients' ) 
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof CustomError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to retrieve patient"})
            }
        }
    }

    public async updatePatient (req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            const updatesReq = req.body
            const patient =  await this.patientService.updatePatient(id, updatesReq)
            if (patient) {
                res.status(200).json(patient)
            } else {
                throw new CustomError ('UpdateError', 'Failed updating patient in controller', 'patients')
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof CustomError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to update patient"})
            }
        }
    }

    public async deletePatient (req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            await this.patientService.deletePatient(id)
            
            res.status(200).json({message: `Patient ${id} was deleted successfully`})
        } catch (error) {
            logger.error(error)
            if (error instanceof CustomError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to delete patient"})
            }
        }
    }

}