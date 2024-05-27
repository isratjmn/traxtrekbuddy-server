import { z } from "zod";

export const registerSchema = z.object({
	name: z.string({
		required_error: "Name is required",
		invalid_type_error: "Name must be a string",
	}),

	email: z.string({
		required_error: "Email is required",
		invalid_type_error: "Email must be a string",
	}),

	password: z
		.string({
			required_error: "Password is required",
			invalid_type_error: "Password must be a string",
		})
		.min(4, "Password must be at least 4 characters long"),

	userProfile: z
		.object({
			bio: z
				.string({
					invalid_type_error: "Bio must be a string",
				})
				.optional(),
			age: z
				.number({
					invalid_type_error: "Age must be a number",
				})
				.optional(),

			profileImage: z
				.string({
					invalid_type_error: "Profile Image must be a string",
				})
				.optional(),
		})
		.optional(),
});

export const AuthValidation = {
	registerSchema,
};
