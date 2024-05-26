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
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ConsignResponse_1 = __importDefault(require("../../../mutual/ConsignResponse"));
const asyncHandler_1 = __importDefault(require("../../../mutual/asyncHandler"));
const user_service_1 = require("./user.service");
const getAllUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.userService.getAllUser(user);
    (0, ConsignResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All User retrieved successfully!",
        data: result,
    });
}));
const updateUserInfo = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.userService.updateUserInfo(id, req.body);
    (0, ConsignResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User info update successfully!",
        data: result,
    });
}));
const updateUserRole = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.userService.updateUserRole(id, req.body);
    (0, ConsignResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User role update successfully!",
        data: result,
    });
}));
exports.userController = {
    getAllUser,
    updateUserInfo,
    updateUserRole,
};
