import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await adminService.getAllUsersFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users fetched successfully",
        data: { users }
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedUser = await adminService.updateUserStatusIntoDB(id as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User status updated successfully",
        data: { updatedUser }
    });
});

const getAllGears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const gearList = await adminService.getAllGearsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear items fetched successfully",
        data: { gearList }
    });
});

const getAllRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rentals = await adminService.getAllRentalsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rentals fetched successfully",
        data: { rentals }
    });
});

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllGears,
    getAllRentals
};