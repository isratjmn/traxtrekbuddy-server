"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUserQueryParams = void 0;
const validateQueryParams_1 = __importDefault(require("./validateQueryParams"));
const buildUserQueryParams = (queryParams = {}) => {
    // Ensure queryParams is always an object
    queryParams = queryParams || {};
    (0, validateQueryParams_1.default)(queryParams);
    const { role, status, email, searchTerm, page = 1, limit = 10, sortBy, sortOrder, } = queryParams;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const where = Object.assign({ AND: [
            role ? { role: { equals: role } } : {},
            status ? { status: { equals: status } } : {},
            email ? { email: { contains: email, mode: "insensitive" } } : {},
        ] }, (searchTerm && {
        OR: [
            { role: { equals: searchTerm } },
            { status: { equals: searchTerm } },
            { email: { contains: searchTerm, mode: "insensitive" } },
        ],
    }));
    return {
        where,
        pageNumber,
        limitNumber,
        sortBy,
        sortOrder,
    };
};
exports.buildUserQueryParams = buildUserQueryParams;
