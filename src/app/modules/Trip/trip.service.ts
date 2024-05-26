import { PrismaClient, TravelBuddyStatus, Trip } from "@prisma/client";
import httpStatus from "http-status";
import validateQueryParams from "../../../Utils/validateQueryParams";
import { TripData } from "./trip.interface";
import { parseISO, format } from "date-fns";
import APIError from "../../errors/APIError";

const prisma = new PrismaClient();

const createTrip = async (tripData: TripData): Promise<Trip> => {
	const defaultImage =
		"https://res.cloudinary.com/dmr810p4l/image/upload/v1716664486/img_akl3jv.webp";
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
	if (tripData.userId) {
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
			orderBy: sortBy
				? {
						[sortBy]: sortOrder || "desc",
				  }
				: { location: "desc" },
			take: limitNumber,
			skip: (pageNumber - 1) * limitNumber,
		}),
		prisma.trip.count({ where }),
	]);

	return {
		success: true,
		statusCode: httpStatus.OK,
		message: "Trips retrieved successfully....!!",
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
	try {
		const trip = await prisma.trip.findUnique({
			where: {
				id: tripId,
			},
		});
		return trip;
	} catch (error) {
		console.error("Error fetching trip details:", error);
		throw error;
	}
};

const sendTravelBuddyRequest = async (tripId: string, userId: string) => {
	try {
		// Check if the trip exists
		const trip = await prisma.trip.findUnique({
			where: { id: tripId },
		});

		if (!trip) {
			throw new APIError(httpStatus.NOT_FOUND, "Trip not found");
		}

		const request = await prisma.travelBuddyRequest.create({
			data: {
				tripId,
				userId,
				status: "PENDING",
			},
		});
		return request;
	} catch (error) {
		throw new Error("Failed to send travel buddy request");
	}
};

/* const deleteTrip = async (id: string) => {
	await prisma.trip.findUniqueOrThrow({
		where: {
			id,
		},
	});
	const result = await prisma.trip.delete({
		where: {
			id,
		},
	});
	return result;
};
 */
const deleteTrip = async (tripId: string) => {
	// Delete related TravelBuddy records first
	await prisma.travelBuddyRequest.deleteMany({
		where: {
			tripId: tripId,
		},
	});

	// Now delete the Trip record
	const result = await prisma.trip.delete({
		where: {
			id: tripId,
		},
	});
	return result;
};

const updateTrip = async (
	id: string,
	payload: Partial<{
		destination: string;
		description: string;
		startDate: string;
		endDate: string;
		travelType?: string;
		itinerary?: string;
		location?: string;
	}>
) => {
	if (payload.startDate) {
		payload.startDate = format(
			parseISO(payload.startDate),
			"yyyy-MM-dd'T'HH:mm:ss'Z'"
		);
	}
	if (payload.endDate) {
		payload.endDate = format(
			parseISO(payload.endDate),
			"yyyy-MM-dd'T'HH:mm:ss'Z'"
		);
	}

	await prisma.trip.findUniqueOrThrow({
		where: {
			id,
		},
	});

	const result = await prisma.trip.update({
		where: { id },
		data: { ...payload },
	});
	return result;
};

export const TripServices = {
	createTrip,
	getTrips,
	getTripById,
	sendTravelBuddyRequest,
	deleteTrip,
	updateTrip,
};
