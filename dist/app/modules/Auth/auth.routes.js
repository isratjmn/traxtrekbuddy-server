"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/register", 
// requestValidate(AuthValidation.registerSchema),
auth_controller_1.AuthControllers.registerUser);
router.post("/login", auth_controller_1.AuthControllers.login);
router.post("/change-password", (0, auth_1.default)(client_1.Role.admin), auth_controller_1.AuthControllers.changePassword);
exports.authRoutes = router;
