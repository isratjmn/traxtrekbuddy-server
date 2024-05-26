import { Response, Request } from 'express';
import httpStatus from 'http-status';
import ConsignResponse from '../../../mutual/ConsignResponse';
import { TripServices } from './trip.service';
import asyncHandler from '../../../mutual/asyncHandler';
import { IUploadFile } from '../../../interfaces/file';
import { UploadFileHelper } from '../../../mutual/UploaderFileHelper';

//* CREATE TRIP
const createTrip = asyncHandler(async (req: Request, res: Response) => {
    const id = req?.user?.id;
    if (!id)
    {
        res.status(401).json({
            success: false,
            message: "Unauthorized: User ID not found",
        });
        return;
    }
    const file = req.file as IUploadFile;
    console.log(file);
    if (file)
    {
        const uploadedProfileImage = await UploadFileHelper.uploadToCloudinary(file);
        console.log(req.body);
        req.body.photos = uploadedProfileImage?.secure_url;
    }
    const tripData = {
        ...req.body,
        userId: id,
    };

    const newTrip = await TripServices.createTrip(tripData);
    ConsignResponse(res, {
        success: true,
        statusCode: 201,
        message: "Trip created successfully...!!",
        data: newTrip,
    });

});


//* GETTING ALL THE TRIPS
const getTrips = asyncHandler(
    async (req: Request, res: Response) => {
        try
        {
            const result = await TripServices.getTrips(req.query);
            return res.status(httpStatus.OK).json(result);
        } catch (error: any)
        {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                statusCode: httpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to fetch trips',
                error: error?.name,
            });
        }
    }
);


//* GET A PERTICULAR TRIP
const getTrip = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.id;

    if (!tripId)
    {
        res.status(400).json({
            success: false,
            message: "Bad Request: Trip ID is required",
        });
        return;
    }

    const trip = await TripServices.getTripById(tripId);

    if (!trip)
    {
        res.status(404).json({
            success: false,
            message: "Trip not found...!!",
        });
        return;
    }

    ConsignResponse(res, {
        success: true,
        statusCode: 200,
        message: "Trip details fetched successfully...!!",
        data: trip,
    });
});

//* TREVEL REQUEST
const sendRequest = asyncHandler(
    async (req: Request, res: Response) => {
        const { tripId } = req.params;
        const userId = req.body?.userId;
        const request = await TripServices.sendTravelBuddyRequest(tripId, userId);
        ConsignResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Travel buddy request sent successfully....!!!',
            data: request,
        });
    }
);


export const TripControllers = {
    createTrip,
    getTrips,
    getTrip,
    sendRequest
};