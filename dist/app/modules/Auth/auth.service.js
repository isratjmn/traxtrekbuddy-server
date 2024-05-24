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
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const APIError_1 = __importDefault(require("../../middlewares/APIError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtUtils_1 = require("../../../Utils/jwtUtils");
const config_1 = __importDefault(require("../../../config"));
const prisma = new client_1.PrismaClient();
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma.user.findUnique({
        where: {
            id: data.id,
            email: data.email,
        },
    });
    if (existingUser) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, 'Email Already Exists!!!');
    }
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 12);
    const userData = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
    };
    const newUser = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield transactionClient.user.create({
            data: userData,
            include: {
                userProfile: true
            }
        });
        console.log(userData);
        if (data.role === 'admin') {
            yield transactionClient.admin.create({
                data: {
                    name: data === null || data === void 0 ? void 0 : data.name,
                    email: data === null || data === void 0 ? void 0 : data.email,
                    password: hashedPassword,
                }
            });
        }
        return createdUser;
    }));
    return newUser;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            name: payload.name,
        },
    });
    if (!userData) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'User not found !!');
    }
    const passwordMatch = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!passwordMatch) {
        throw new Error('Incorrect Password !!');
    }
    const token = jwtUtils_1.jwtUtils.generateToken({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.currentPassword, userData.password);
    if (!isCorrectPassword) {
        throw new APIError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect password");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 10);
    yield prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: "Password changed successfully",
    };
});
exports.AuthServices = {
    createUser,
    loginUser,
    changePassword
};
