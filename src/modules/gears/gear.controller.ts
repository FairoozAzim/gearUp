import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { gearService } from "./gear.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryController } from "../categories/category.controller";

// const createGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const providerId = req.user?.id as string;
//     const payload = req.body;
//     const gear = await gearService.createGearIntoDB(providerId, payload);

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.CREATED,
//         message: "Gear item added successfully",
//         data: { gear }
//     });
// });

const getAllGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filters = req.query;
    const gearList = await gearService.getAllGearFromDB(filters);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear items fetched successfully",
        data: { gearList }
    });
});

const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const gear = await gearService.getGearByIdFromDB(id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear item fetched successfully",
        data: { gear }
    });
});





export const gearController = {
    getAllGear,
    getGearById,
};