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
exports.AuthControllers = void 0;
const ConsignResponse_1 = __importDefault(require("../../../mutual/ConsignResponse"));
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const asyncHandler_1 = __importDefault(require("../../../mutual/asyncHandler"));
/* const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword, role } = req.body;

    const file = req.file as IUploadFile;

    if (file) {
        const uploadedProfileImage = await UploadFileHelper.uploadToCloudinary(
            file
        );
        req.body.profileImage = uploadedProfileImage?.secure_url;
    }

    // Declare userProfile and initialize it with an empty object
    let userProfile: any = {};

    const result = await AuthServices.createUser({
        name,
        email,
        password,
        confirmPassword,
        role,
        userProfile: {
            profileImage: req.body.profileImage,
        },
    });
    console.log(result);

    ConsignResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User registered successfully.....!!",
        data: {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role,
            profileImage: userProfile?.profileImage,
        },
    });
}); */
const registerUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, password, confirmPassword, role, userProfile } = req.body;
    const result = yield auth_service_1.AuthServices.createUser({
        name,
        email,
        password,
        confirmPassword,
        role,
        userProfile: {
            profileImage: userProfile === null || userProfile === void 0 ? void 0 : userProfile.profileImage,
        },
    });
    (0, ConsignResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User registered successfully.....!!",
        data: {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role,
            userProfile: (_a = result === null || result === void 0 ? void 0 : result.userProfile) === null || _a === void 0 ? void 0 : _a.profileImage,
        },
    });
}));
const login = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    const result = yield auth_service_1.AuthServices.loginUser({
        name,
        email,
        password,
        role,
    });
    (0, ConsignResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Login Successfully......!!",
        data: {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role,
            token: result.token,
        },
    });
}));
const changePassword = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const result = yield auth_service_1.AuthServices.changePassword(user, {
        currentPassword,
        newPassword,
        confirmPassword,
    });
    (0, ConsignResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password changed successfully....",
        data: result,
    });
}));
exports.AuthControllers = {
    registerUser,
    login,
    changePassword,
};
