import { Prisma } from "@prisma/client";
import validateQueryParams from "./validateQueryParams";

export const buildQueryParams = (queryParams: any = {}) => {
	validateQueryParams(queryParams);
	const {
		destination,
		description,
		startDate,
		endDate,
		travelType,
		searchTerm,
		page = 1,
		limit = 10,
		sortBy,
		sortOrder,
	} = queryParams;

	const pageNumber = parseInt(page);
	const limitNumber = parseInt(limit);

	// Ensure we don't add empty conditions
	const where: Prisma.TripWhereInput = {
		AND: [
			destination
				? {
						destination: {
							contains: destination,
							mode: "insensitive",
						},
				  }
				: undefined,
			description
				? {
						description: {
							contains: description,
							mode: "insensitive",
						},
				  }
				: undefined,
			startDate ? { startDate: { gte: new Date(startDate) } } : undefined,
			endDate ? { endDate: { lte: new Date(endDate) } } : undefined,
			travelType
				? { travelType: { contains: travelType, mode: "insensitive" } }
				: undefined,
		].filter(Boolean),
		...(searchTerm && {
			OR: [
				{ destination: { contains: searchTerm, mode: "insensitive" } },
				{ description: { contains: searchTerm, mode: "insensitive" } },
				{ travelType: { contains: searchTerm, mode: "insensitive" } },
				{ location: { contains: searchTerm, mode: "insensitive" } },
			],
		}),
	};

	return {
		where,
		pageNumber,
		limitNumber,
		sortBy,
		sortOrder,
	};
};
