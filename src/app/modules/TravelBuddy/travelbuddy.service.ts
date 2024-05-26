// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

const prisma = new PrismaClient();

const getTravelBuddies = async (tripId: string) => {
	const travelBuddies = await prisma.travelBuddyRequest.findMany({
		where: {
			tripId,
		},
		include: {
			user: true,
		},
	});
	// Extract relevant data and return
	return travelBuddies.map(
		({ id, tripId, userId, status, createdAt, updatedAt, user }) => ({
			id,
			tripId,
			userId,
			status,
			createdAt,
			updatedAt,
			user: {
				name: user.name,
				email: user.email,
			},
		})
	);
};

const getTravelRequestHistory = async (userId: string) => {
	const requests = await prisma.travelBuddyRequest.findMany({
		where: {
			userId: userId,
		},
		include: {
			trip: true,
		},
	});

	return requests.map((request) => ({
		trip: {
			destination: request.trip.destination,
		},
		status: request.status,
	}));
};


interface TravelBuddyRequest {
	id: string;
	tripId: string;
	userId: string;
	status: TravelBuddyStatus;
}

const respondToTravelBuddy = async (
	buddyId: string,
	payload: {
		tripId: string;
		status: string;
	},
	userId: string
) => {
	const buddyRequest = await prisma.travelBuddyRequest.findUnique({
		where: {
			id: buddyId,
		},
	});
	if (!buddyRequest) {
		throw new APIError(
			httpStatus.NOT_FOUND,
			"Travel buddy request not found"
		);
	}
	const updatedRequest = await prisma.travelBuddyRequest.update({
		where: {
			id: buddyId,
		},
		data: {
			status: payload.status as TravelBuddyStatus,
			updatedAt: new Date(),
		},
		include: {
			trip: true,
		},
	});

	return {
		id: updatedRequest.id,
		tripId: updatedRequest.tripId,
		userId: updatedRequest.userId,
		status: updatedRequest.status,
		createdAt: updatedRequest.createdAt,
		updatedAt: updatedRequest.updatedAt,
	};
};

export const TravelBuddyServices = {
	getTravelBuddies,
	getTravelRequestHistory,
	respondToTravelBuddy,
};
