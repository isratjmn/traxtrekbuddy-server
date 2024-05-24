"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelBuddyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const travelbuddy_controller_1 = require("./travelbuddy.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/:tripId", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin), travelbuddy_controller_1.TravelBuddyControllers.getPotentialTravelBuddies);
router.get("/history", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin), travelbuddy_controller_1.TravelBuddyControllers.getTravelRequestHistory);
router.put("/:buddyId/respond", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin), travelbuddy_controller_1.TravelBuddyControllers.respondToRequest);
exports.travelBuddyRoutes = router;
