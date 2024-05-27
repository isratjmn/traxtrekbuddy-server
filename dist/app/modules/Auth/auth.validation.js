"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }),
    email: zod_1.z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }),
    password: zod_1.z
        .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    })
        .min(4, "Password must be at least 4 characters long"),
    userProfile: zod_1.z
        .object({
        bio: zod_1.z
            .string({
            invalid_type_error: "Bio must be a string",
        })
            .optional(),
        age: zod_1.z
            .number({
            invalid_type_error: "Age must be a number",
        })
            .optional(),
        profileImage: zod_1.z
            .string({
            invalid_type_error: "Profile Image must be a string",
        })
            .optional(),
    })
        .optional(),
});
exports.AuthValidation = {
    registerSchema: exports.registerSchema,
};
