"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripsRoutes = exports.tripRoutes = void 0;
const auth_1 = __importDefault(require("../../middlewares/auth"));
const trip_controller_1 = require("./trip.controller");
const express_1 = __importDefault(require("express"));
const trip_validation_1 = require("./trip.validation");
const UploaderFileHelper_1 = require("../../../mutual/UploaderFileHelper");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
exports.tripRoutes = router;
exports.tripsRoutes = router;
router.post("/", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin), UploaderFileHelper_1.UploadFileHelper.upload.single("file"), (req, res, next) => {
    req.body = trip_validation_1.TripsValidation.CreateTripSchema.parse(JSON.parse(req.body.data));
    return trip_controller_1.TripControllers.createTrip(req, res, next);
});
router.get("/", trip_controller_1.TripControllers.getTrips);
router.get("/:id", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin), trip_controller_1.TripControllers.getTrip);
router.post("/:tripId/request", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin), trip_controller_1.TripControllers.sendRequest);
router.delete("/:id", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin), trip_controller_1.TripControllers.deleteTrip);
router.patch("/:id", 
// auth(Role.user, Role.admin),
trip_controller_1.TripControllers.updateTrip);
