import express, {Request, Response } from 'express'
import logger from './utils/logger' 
import routes from './api/routes'
import { errorHandlerMiddleware } from './middleware/errorHandler'
import cookieParser from 'cookie-parser';

const app = express()
const port = 8087
app.use(express.json())
app.use( errorHandlerMiddleware )
app.use(cookieParser());
app.use('/api/v1', routes)


app.listen(port, () =>{
    logger.info(`Server is listening on port ${port}`)
}
)
