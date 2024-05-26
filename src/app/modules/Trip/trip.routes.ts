
import auth from '../../middlewares/auth';
import { TripControllers } from './trip.controller';
import express, { Request, Response, NextFunction } from 'express';
import { TripsValidation } from './trip.validation';
import requestvalidate from '../../middlewares/requstValidate';
import { UploadFileHelper } from '../../../mutual/UploaderFileHelper';

const router = express.Router();

router.post('/',
    auth("user", "admin"),
    UploadFileHelper.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = TripsValidation.CreateTripSchema.parse(JSON.parse(req.body.data));
        console.log(req.body);
        return TripControllers.createTrip(req, res, next);
    }
);

router.get('/', TripControllers.getTrips);

router.get('/:id', TripControllers.getTrip);

router.post('/:tripId/request', auth("admin"), TripControllers.sendRequest);

export { router as tripRoutes, router as tripsRoutes };






