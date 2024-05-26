"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsValidation = exports.CreateTripSchema = void 0;
const zod_1 = require("zod");
exports.CreateTripSchema = zod_1.z.object({
    destination: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    startDate: zod_1.z.string().transform((str) => new Date(str)).refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date format",
    }),
    endDate: zod_1.z.string().transform((str) => new Date(str)).refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date format",
    }),
    travelType: zod_1.z.string().min(1),
    photos: zod_1.z.string().optional(),
    itinerary: zod_1.z.string().min(1),
    location: zod_1.z.string().min(1),
});
exports.TripsValidation = {
    CreateTripSchema: exports.CreateTripSchema,
};
