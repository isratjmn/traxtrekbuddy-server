import httpStatus from "http-status";
import ConsignResponse from "../../../mutual/ConsignResponse";
import { Response, Request } from 'express';
import { TravelBuddyServices } from "./travelbuddy.service";
import asyncHandler from "../../../mutual/asyncHandler";


const getPotentialTravelBuddies = asyncHandler(
    async (req: Request, res: Response) => {
        const { tripId } = req.params;
        console.log("--------tripId--------------", tripId);
        const potentialBuddies = await TravelBuddyServices.getTravelBuddies(tripId);

        return ConsignResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Potential travel buddies retrieved successfully...!!',
            data: potentialBuddies,
        });
    }
);

const respondToRequest = asyncHandler(
    async (req: Request, res: Response) => {
        const { buddyId } = req.params;
        const { tripId, status } = req.body;

        const response = await TravelBuddyServices.respondToTravelBuddy(
            buddyId, tripId, status);

        ConsignResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Travel buddy request responded successfully',
            data: response,
        });

    }
);

export const TravelBuddyControllers = {
    getPotentialTravelBuddies, respondToRequest
}; 