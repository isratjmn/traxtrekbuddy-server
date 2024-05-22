"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const requstValidate_1 = __importDefault(require("../../middlewares/requstValidate"));
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post('/', (0, requstValidate_1.default)(user_validation_1.UserValidation.CreateUserSchema), user_controller_1.UserControllers.createUser);
exports.userRoutes = router;
