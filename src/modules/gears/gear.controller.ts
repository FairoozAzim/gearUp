import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { gearService } from "./gear.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



const getAllGears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
    getAllGears,
    getGearById,
};