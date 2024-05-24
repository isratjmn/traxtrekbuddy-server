"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateQueryParams = (queryParams) => {
    const allowedParams = new Set([
        "destination",
        "description",
        "startDate",
        "endDate",
        "travelType",
        "location",
        "searchTerm",
        "role",
        "status",
        "email",
        "page",
        "limit",
        "sortBy",
        "sortOrder",
    ]);
    for (const param in queryParams) {
        if (!allowedParams.has(param)) {
            throw new Error(`Invalid query parameter: ${param}`);
        }
    }
};
exports.default = validateQueryParams;
