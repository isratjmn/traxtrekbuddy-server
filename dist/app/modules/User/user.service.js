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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
/* const createUser = async (data: TUser) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
            role: data.role
        },
    });
    if (existingUser)
    {
        throw new Error('Email Already Exists!!!');
    }
    const hashedPassword: string = await bcrypt.hash(data.password, 12);
    const userData = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        userProfile: {
            create: {
                bio: data.userProfile.bio,
                age: data.userProfile.age
            }
        }
    };
    const newUserAndProfile = await prisma.$transaction(async (transactionClient) => {
        const createUserData = await transactionClient.user.create({
            data: userData,
            include: {
                userProfile: true
            }
        });
        return createUserData;
    });
    return newUserAndProfile;
}; */
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (existingUser) {
        throw new Error('Email Already Exists!!!');
    }
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 12);
    const userData = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        userProfile: {
            create: {
                bio: data.userProfile.bio,
                age: data.userProfile.age
            }
        }
    };
    const newUser = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield transactionClient.user.create({
            data: userData,
            include: {
                userProfile: true
            }
        });
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
exports.UserService = {
    createUser
};
