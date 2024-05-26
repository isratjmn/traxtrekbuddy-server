import { PrismaClient, Trip } from "@prisma/client";
import httpStatus from "http-status";
import validateQueryParams from "../../../Utils/validateQueryParams";
import { TripData } from "./trip.interface";

const prisma = new PrismaClient();

const createTrip = async (tripData: TripData): Promise<Trip> => {
    const defaultImage = 'https://res.cloudinary.com/dmr810p4l/image/upload/v1716664486/img_akl3jv.webp';
    const data: any = {
        destination: tripData.destination,
        description: tripData.description,
        startDate: new Date(tripData.startDate).toISOString(),
        endDate: new Date(tripData.endDate).toISOString(),
        travelType: tripData.travelType,
        photos: tripData.photos || defaultImage,
        itinerary: tripData.itinerary,
        location: tripData.location,
    };
    if (tripData.userId)
    {
        data.userId = tripData.userId;
    }

    const trip = await prisma.trip.create({
        data,
    });
    return trip;
};


const getTrips = async (queryParams: any) => {
    validateQueryParams(queryParams);
    const {
        destination,
        description,
        startDate,
        endDate,
        travelType,
        itinerary,
        location,
        // budget,
        searchTerm,
        /* minBudget,
        maxBudget, */
        page = 1,
        limit = 10,
        sortBy,
        sortOrder,
    } = queryParams;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const where = {
        destination: destination ? { contains: destination } : undefined,
        startDate: startDate ? { gte: new Date(startDate) } : undefined,
        endDate: endDate ? { lte: new Date(endDate) } : undefined,

        /* budget: budget
            ? {
                gte: parseInt(budget.minBudget),
                lte: parseInt(budget.maxBudget),
            }
            : undefined,
        OR: searchTerm
            ? [
                { destination: { contains: searchTerm } },
                { budget: parseInt(searchTerm) },
            ]
            : undefined, */
    };

    /* if (minBudget && maxBudget)
    {
        where.budget = {
            gte: parseInt(minBudget),
            lte: parseInt(maxBudget),
        };
    } */
    const [trips, totalCount] = await Promise.all([
        prisma.trip.findMany({
            where,
            orderBy: sortBy ? {
                [sortBy]: sortOrder || 'desc'
            } : { location: 'desc' },
            take: limitNumber,
            skip: (pageNumber - 1) * limitNumber,
        }),
        prisma.trip.count({ where }),
    ]);

    return {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Trips retrieved successfully....!!',
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total: totalCount,
        },
        data: trips,
    };
};


//* GET A PERTICULAR TRIP
const getTripById = async (tripId: string) => {
    try
    {
        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId,
            },
        });
        return trip;
    } catch (error)
    {
        console.error('Error fetching trip details:', error);
        throw error;
    }
};


const sendTravelBuddyRequest = async (tripId: string, userId: string) => {
    try
    {
        const request = await prisma.travelBuddyRequest.create({
            data: {
                tripId,
                userId,
                status: 'PENDING',
            },
        });
        return request;
    } catch (error)
    {
        throw new Error('Failed to send travel buddy request');
    }
};

export const TripServices = {
    createTrip,
    getTrips,
    getTripById,
    sendTravelBuddyRequest
};