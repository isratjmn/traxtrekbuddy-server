"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const requstValidate_1 = __importDefault(require("../../middlewares/requstValidate"));
const router = express_1.default.Router();
router.post('/register', (0, requstValidate_1.default)(auth_validation_1.AuthValidation.registerSchema), auth_controller_1.AuthControllers.registerUser);
router.post('/login', auth_controller_1.AuthControllers.login);
exports.authRoutes = router;
