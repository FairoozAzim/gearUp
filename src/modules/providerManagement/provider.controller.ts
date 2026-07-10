import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { providerService } from "./provider.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string;
    const payload = req.body;
    const gear = await providerService.createGearIntoDB(providerId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Gear item added successfully",
        data: { gear }
    });
});

const getMyGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string;
    const gearList = await providerService.getMyGearFromDB(providerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your gear items fetched successfully",
        data: { gearList }
    });
});

const updateGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string;
    const { id } = req.params;
    const payload = req.body;
    const updatedGear = await providerService.updateGearIntoDB(providerId, id as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear item updated successfully",
        data: { updatedGear }
    });
});

const deleteGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string;
    const { id } = req.params;
    const deletedGear = await providerService.deleteGearFromDB(providerId, id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear item removed successfully",
        data: { deletedGear }
    });
});


export const providerController = {
    createGear,
    getMyGear,
    updateGear,
    deleteGear
};