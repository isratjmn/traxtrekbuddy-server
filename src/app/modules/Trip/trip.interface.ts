
export interface TripData {
    userId?: string;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    travelType: string;
    photos?: string | null;
    itinerary: string;
    location: string;
}