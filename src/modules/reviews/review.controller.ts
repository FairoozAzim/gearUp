import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;
    const review = await reviewService.createReviewIntoDB(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review submitted successfully",
        data: { review }
    });
});

const getGearReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { itemId } = req.params;
    const reviews = await reviewService.getGearReviewsFromDB(itemId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reviews fetched successfully",
        data: { reviews }
    });
});

export const reviewController = {
    createReview,
    getGearReviews
};