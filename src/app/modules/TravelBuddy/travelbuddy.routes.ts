
import express from 'express';
import { TravelBuddyControllers } from './travelbuddy.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/:tripId', auth("admin"), TravelBuddyControllers.getPotentialTravelBuddies);

router.put('/:buddyId/respond', auth("user"), TravelBuddyControllers.respondToRequest);

export const travelBuddyRoutes = router;