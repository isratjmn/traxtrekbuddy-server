"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ConsignResponse_1 = __importDefault(require("../../../mutual/ConsignResponse"));
const trip_service_1 = require("./trip.service");
const asyncHandler_1 = __importDefault(require("../../../mutual/asyncHandler"));
const UploaderFileHelper_1 = require("../../../mutual/UploaderFileHelper");
//* CREATE TRIP
const createTrip = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!id) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: User ID not found",
        });
        return;
    }
    const file = req.file;
    console.log(file);
    if (file) {
        const uploadedProfileImage = yield UploaderFileHelper_1.UploadFileHelper.uploadToCloudinary(file);
        console.log(req.body);
        req.body.photos = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
    }
    const tripData = Object.assign(Object.assign({}, req.body), { userId: id });
    const newTrip = yield trip_service_1.TripServices.createTrip(tripData);
    (0, ConsignResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Trip created successfully...!!",
        data: newTrip,
    });
}));
//* GETTING ALL THE TRIPS
const getTrips = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield trip_service_1.TripServices.getTrips(req.query);
        return res.status(http_status_1.default.OK).json(result);
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'Failed to fetch trips',
            error: error === null || error === void 0 ? void 0 : error.name,
        });
    }
}));
//* GET A PERTICULAR TRIP
const getTrip = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tripId = req.params.id;
    if (!tripId) {
        res.status(400).json({
            success: false,
            message: "Bad Request: Trip ID is required",
        });
        return;
    }
    const trip = yield trip_service_1.TripServices.getTripById(tripId);
    if (!trip) {
        res.status(404).json({
            success: false,
            message: "Trip not found...!!",
        });
        return;
    }
    (0, ConsignResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Trip details fetched successfully...!!",
        data: trip,
    });
}));
//* TREVEL REQUEST
const sendRequest = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { tripId } = req.params;
    const userId = (_b = req.body) === null || _b === void 0 ? void 0 : _b.userId;
    const request = yield trip_service_1.TripServices.sendTravelBuddyRequest(tripId, userId);
    (0, ConsignResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Travel buddy request sent successfully....!!!',
        data: request,
    });
}));
exports.TripControllers = {
    createTrip,
    getTrips,
    getTrip,
    sendRequest
};
