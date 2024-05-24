"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("./profile.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin), profile_controller_1.UserProfileControllers.getUserProfile);
router.get("/my-profile", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin), profile_controller_1.UserProfileControllers.getMyProfile);
router.patch("/:id", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin), 
// requestvalidate(UserProfileValidation.UpdateProfileSchema),
profile_controller_1.UserProfileControllers.updateProfile);
exports.profileRoutes = router;
