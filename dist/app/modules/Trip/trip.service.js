"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripServices = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const date_fns_1 = require("date-fns");
const APIError_1 = __importDefault(require("../../errors/APIError"));
const buildQueryParams_1 = require("../../../Utils/buildQueryParams");
const prisma = new client_1.PrismaClient();
const createTrip = (tripData) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultImage = "https://res.cloudinary.com/dmr810p4l/image/upload/v1716664486/img_akl3jv.webp";
    const data = {
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
    const trip = yield prisma.trip.create({
        data,
    });
    return trip;
});
// const getTrips = async (queryParams: any) => {
// 	validateQueryParams(queryParams);
// 	const {
// 		destination,
// 		description,
// 		startDate,
// 		endDate,
// 		travelType,
// 		searchTerm,
// 		page = 1,
// 		limit = 10,
// 		sortBy,
// 		sortOrder,
// 	} = queryParams;
// 	const pageNumber = parseInt(page);
// 	const limitNumber = parseInt(limit);
// 	const where = {
// 		destination: destination ? { contains: destination } : undefined,
// 		startDate: startDate ? { gte: new Date(startDate) } : undefined,
// 		endDate: endDate ? { lte: new Date(endDate) } : undefined,
// 		/* budget: budget
//             ? {
//                 gte: parseInt(budget.minBudget),
//                 lte: parseInt(budget.maxBudget),
//             }
//             : undefined,
//         OR: searchTerm
//             ? [
//                 { destination: { contains: searchTerm } },
//                 { budget: parseInt(searchTerm) },
//             ]
//             : undefined, */
// 	};
// 	/* if (minBudget && maxBudget)
//     {
//         where.budget = {
//             gte: parseInt(minBudget),
//             lte: parseInt(maxBudget),
//         };
//     } */
// 	const [trips, totalCount] = await Promise.all([
// 		prisma.trip.findMany({
// 			where,
// 			orderBy: sortBy
// 				? {
// 						[sortBy]: sortOrder || "desc",
// 				}
// 				: { location: "desc" },
// 			take: limitNumber,
// 			skip: (pageNumber - 1) * limitNumber,
// 		}),
// 		prisma.trip.count({ where }),
// 	]);
// 	return {
// 		success: true,
// 		statusCode: httpStatus.OK,
// 		message: "Trips retrieved successfully....!!",
// 		meta: {
// 			page: pageNumber,
// 			limit: limitNumber,
// 			total: totalCount,
// 		},
// 		data: trips,
// 	};
// };
// const getTrips = async (queryParams: any) => {
// 	validateQueryParams(queryParams);
// 	const {
// 		destination,
// 		description,
// 		startDate,
// 		endDate,
// 		travelType,
// 		searchTerm,
// 		page = 1,
// 		limit = 10,
// 		sortBy,
// 		sortOrder,
// 	} = queryParams;
// 	const pageNumber = parseInt(page);
// 	const limitNumber = parseInt(limit);
// 	const where: any = {
// 		AND: [
// 			destination
// 				? {
// 						destination: {
// 							contains: destination,
// 							mode: "insensitive",
// 						},
// 				  }
// 				: {},
// 			description
// 				? {
// 						description: {
// 							contains: description,
// 							mode: "insensitive",
// 						},
// 				  }
// 				: {},
// 			startDate ? { startDate: { gte: new Date(startDate) } } : {},
// 			endDate ? { endDate: { lte: new Date(endDate) } } : {},
// 			travelType
// 				? { travelType: { contains: travelType, mode: "insensitive" } }
// 				: {},
// 		],
// 		...(searchTerm && {
// 			OR: [
// 				{ destination: { contains: searchTerm, mode: "insensitive" } },
// 				{ description: { contains: searchTerm, mode: "insensitive" } },
// 				{ travelType: { contains: searchTerm, mode: "insensitive" } },
// 				{ location: { contains: searchTerm, mode: "insensitive" } },
// 			],
// 		}),
// 	};
// 	const [trips, totalCount] = await Promise.all([
// 		prisma.trip.findMany({
// 			where,
// 			orderBy: sortBy
// 				? {
// 						[sortBy]: sortOrder || "desc",
// 				  }
// 				: { location: "desc" },
// 			take: limitNumber,
// 			skip: (pageNumber - 1) * limitNumber,
// 		}),
// 		prisma.trip.count({ where }),
// 	]);
// 	return {
// 		success: true,
// 		statusCode: httpStatus.OK,
// 		message: "Trips retrieved successfully....!!",
// 		meta: {
// 			page: pageNumber,
// 			limit: limitNumber,
// 			total: totalCount,
// 		},
// 		data: trips,
// 	};
// };
const getTrips = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { where, pageNumber, limitNumber, sortBy, sortOrder } = (0, buildQueryParams_1.buildQueryParams)(queryParams);
    const [trips, totalCount] = yield Promise.all([
        prisma.trip.findMany({
            where,
            orderBy: sortBy
                ? {
                    [sortBy]: sortOrder || "desc",
                }
                : { createdAt: "desc" },
            take: limitNumber,
            skip: (pageNumber - 1) * limitNumber,
        }),
        prisma.trip.count({ where }),
    ]);
    return {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Trips retrieved successfully....!!",
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total: totalCount,
        },
        data: trips,
    };
});
//* GET A PERTICULAR TRIP
const getTripById = (tripId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trip = yield prisma.trip.findUnique({
            where: {
                id: tripId,
            },
        });
        return trip;
    }
    catch (error) {
        console.error("Error fetching trip details:", error);
        throw error;
    }
});
const sendTravelBuddyRequest = (user, tripId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the user has already sent two requests for the trip
        const requestCount = yield prisma.travelBuddyRequest.count({
            where: {
                tripId,
                userId: user.id,
            },
        });
        if (requestCount >= 2) {
            throw new Error("You cannot send more than two requests for this trip.");
        }
        // Proceed with creating the request if the limit is not reached
        const trip = yield prisma.trip.findUnique({
            where: {
                id: tripId,
            },
        });
        if (!trip) {
            throw new APIError_1.default(http_status_1.default.NOT_FOUND, "Trip not found");
        }
        const request = yield prisma.travelBuddyRequest.create({
            data: {
                tripId,
                userId: user.id,
                status: "PENDING",
            },
        });
        return request;
    }
    catch (error) {
        throw new Error("Failed to send travel buddy request");
    }
});
const deleteTrip = (tripId) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete related TravelBuddy records first
    yield prisma.travelBuddyRequest.deleteMany({
        where: {
            tripId: tripId,
        },
    });
    // Now delete the Trip record
    const result = yield prisma.trip.delete({
        where: {
            id: tripId,
        },
    });
    return result;
});
const updateTrip = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.startDate) {
        payload.startDate = (0, date_fns_1.format)((0, date_fns_1.parseISO)(payload.startDate), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    }
    if (payload.endDate) {
        payload.endDate = (0, date_fns_1.format)((0, date_fns_1.parseISO)(payload.endDate), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    }
    yield prisma.trip.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma.trip.update({
        where: { id },
        data: Object.assign({}, payload),
    });
    return result;
});
exports.TripServices = {
    createTrip,
    getTrips,
    getTripById,
    sendTravelBuddyRequest,
    deleteTrip,
    updateTrip,
};
