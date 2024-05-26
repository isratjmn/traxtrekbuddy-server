import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { TUser } from "./user.interface";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

const prisma = new PrismaClient();



export const UserService = {

};