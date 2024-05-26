import { z } from 'zod';

export const CreateTripSchema = z.object({
    destination: z.string().min(1),
    description: z.string().min(1),
    startDate: z.string().transform((str) => new Date(str)).refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date format",
    }),
    endDate: z.string().transform((str) => new Date(str)).refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date format",
    }),
    travelType: z.string().min(1),
    photos: z.string().optional(),
    itinerary: z.string().min(1),
    location: z.string().min(1),
});


export const TripsValidation = {
    CreateTripSchema,
};
