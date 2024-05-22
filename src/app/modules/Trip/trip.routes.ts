
import auth from '../../middlewares/auth';
import { TripControllers } from './trip.controller';
import express from 'express';
import { TripsValidation } from './trip.validation';
import requestvalidate from '../../middlewares/requstValidate';

const router = express.Router();

router.post('/',
    auth("user", "admin"),
    requestvalidate(TripsValidation.CreateTripSchema),
    TripControllers.createTrip);

router.get('/', TripControllers.getTrips);

router.get('/:id', TripControllers.getTrip);

router.post('/:tripId/request', auth("admin"), TripControllers.sendRequest);

export { router as tripRoutes, router as tripsRoutes };






