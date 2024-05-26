"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const updateStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["ACTIVE", "DEACTIVE"]),
    }),
});
const updateRole = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.enum(["admin", "user"]),
    }),
});
exports.UserValidation = {
    updateStatus,
    updateRole,
};
