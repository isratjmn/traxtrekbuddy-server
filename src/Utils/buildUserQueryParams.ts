import { Prisma } from "@prisma/client";
import validateQueryParams from "./validateQueryParams";

export const buildUserQueryParams = (queryParams: any = {}) => {
	// Ensure queryParams is always an object
	queryParams = queryParams || {};

	validateQueryParams(queryParams);

	const {
		role,
		status,
		email,
		searchTerm,
		page = 1,
		limit = 10,
		sortBy,
		sortOrder,
	} = queryParams;

	const pageNumber = parseInt(page);
	const limitNumber = parseInt(limit);

	const where: Prisma.UserWhereInput = {
		AND: [
			role ? { role: { equals: role } } : {},
			status ? { status: { equals: status } } : {},
			email ? { email: { contains: email, mode: "insensitive" } } : {},
		],
		...(searchTerm && {
			OR: [
				{ role: { equals: searchTerm as any } },
				{ status: { equals: searchTerm as any } },
				{ email: { contains: searchTerm, mode: "insensitive" } },
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
