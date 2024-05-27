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
const APIError_1 = __importDefault(require("../../errors/APIError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtUtils_1 = require("../../../Utils/jwtUtils");
const config_1 = __importDefault(require("../../../config"));
const prisma = new client_1.PrismaClient();
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const existingUser = yield prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (existingUser) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, "Email Already Exists!!!");
    }
    if (data.password !== data.confirmPassword) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, "Passwords do not match!!!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 12);
    const userData = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
    };
    const newUser = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        var _g, _h, _j, _k, _l, _m;
        const createdUser = yield transactionClient.user.create({
            data: userData,
        });
        if (data.role === "admin") {
            yield transactionClient.admin.create({
                data: {
                    name: data === null || data === void 0 ? void 0 : data.name,
                    email: data === null || data === void 0 ? void 0 : data.email,
                    password: hashedPassword,
                },
            });
        }
        yield transactionClient.userProfile.create({
            data: {
                userId: createdUser.id,
                bio: (_h = (_g = data.userProfile) === null || _g === void 0 ? void 0 : _g.bio) !== null && _h !== void 0 ? _h : "Hi, I'm a travel buddy looking for exciting adventures!",
                profileImage: (_k = (_j = data.userProfile) === null || _j === void 0 ? void 0 : _j.profileImage) !== null && _k !== void 0 ? _k : "https://res.cloudinary.com/dmr810p4l/image/upload/v1717297396/2150771125_osnw4b.jpg",
                age: (_m = (_l = data.userProfile) === null || _l === void 0 ? void 0 : _l.age) !== null && _m !== void 0 ? _m : 25,
            },
        });
        // Generate the token but do not return it
        jwtUtils_1.jwtUtils.generateToken({
            email: userData.email,
            name: userData.name,
            role: userData.role,
        }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
        return createdUser;
    }));
    return Object.assign(Object.assign({}, newUser), { userProfile: {
            profileImage: (_b = (_a = data.userProfile) === null || _a === void 0 ? void 0 : _a.profileImage) !== null && _b !== void 0 ? _b : "https://res.cloudinary.com/dmr810p4l/image/upload/v1717297396/2150771125_osnw4b.jpg",
            bio: (_d = (_c = data.userProfile) === null || _c === void 0 ? void 0 : _c.bio) !== null && _d !== void 0 ? _d : "Hi, I'm a travel buddy looking for exciting adventures!",
            age: (_f = (_e = data.userProfile) === null || _e === void 0 ? void 0 : _e.age) !== null && _f !== void 0 ? _f : 25,
        } });
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            name: payload.name,
        },
    });
    if (!userData) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, "User not found !!");
    }
    const passwordMatch = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!passwordMatch) {
        throw new Error("Incorrect Password !!");
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
const changePassword = (user_1, _o) => __awaiter(void 0, [user_1, _o], void 0, function* (user, { currentPassword, newPassword, confirmPassword }) {
    if (newPassword !== confirmPassword) {
        throw new Error("New password and confirm password do not match");
    }
    const userData = yield prisma.user.findUniqueOrThrow({
        where: {
            id: user.id,
            email: user.email,
        },
    });
    if (!userData) {
        throw new Error("User not found");
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(currentPassword, userData.password);
    if (!isCorrectPassword) {
        throw new APIError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect password");
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
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
    changePassword,
};
