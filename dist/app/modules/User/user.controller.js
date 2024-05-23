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
exports.UserControllers = void 0;
const user_service_1 = require("./user.service");
const asyncHandler_1 = __importDefault(require("../../../mutual/asyncHandler"));
/* export const createUser = asyncHandler(async (req: Request, res: Response) => {

    const userData: TUser = req.body;
    // Call the createUser service function
    const newUser = await UserService.createUser(userData);
    ConsignResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Created Successfully",
        data: userData
    });

}); */
const createUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, userProfile } = req.body;
    try {
        const newUser = yield user_service_1.UserService.createUser({
            name,
            email,
            password,
            role,
            userProfile
        });
        res.status(201).json({
            success: true,
            message: role === 'admin' ? "Admin created successfully!" : "User created successfully!",
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                userProfile: newUser.userProfile
            }
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}));
exports.UserControllers = {
    createUser
};
