import { z } from "zod";

const updateStatus = z.object({
	body: z.object({
		status: z.enum(["ACTIVE", "DEACTIVE"]),
	}),
});

const updateRole = z.object({
	body: z.object({
		role: z.enum(["admin", "user"]),
	}),
});

export const UserValidation = {
	updateStatus,
	updateRole,
};
