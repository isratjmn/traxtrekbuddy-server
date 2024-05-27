"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_controller_1 = require("./user.controller");
const client_1 = require("@prisma/client");
const requstValidate_1 = __importDefault(require("../../middlewares/requstValidate"));
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.get("/users", (0, auth_1.default)(client_1.Role.admin, client_1.Role.user), user_controller_1.userController.getAllUser);
router.patch("/:id/status", (0, auth_1.default)(client_1.Role.admin), (0, requstValidate_1.default)(user_validation_1.UserValidation.updateStatus), user_controller_1.userController.updateUserInfo);
router.patch("/:id/role", (0, auth_1.default)(client_1.Role.admin), user_controller_1.userController.updateUserRole);
router.get("/dashboard-data", (0, auth_1.default)(client_1.Role.admin), user_controller_1.userController.getDashboardData);
exports.userRoute = router;
