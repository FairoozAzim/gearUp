import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { paymentService } from "./payment.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;
    const result = await paymentService.createPaymentIntoDB(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Payment session created successfully",
        data: result
    });
});

const stripeWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["stripe-signature"] as string;
    const result = await paymentService.handleStripeWebhook(req.body, signature);

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message: "Webhook triggered successfully",
        data: null
    })
});

const getMyPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payments = await paymentService.getMyPaymentsFromDB(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment history fetched successfully",
        data: { payments }
    });
});

const getPaymentDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { id } = req.params;
    const payment = await paymentService.getPaymentDetailsFromDB(id as string, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment details fetched successfully",
        data: { payment }
    });
});

export const paymentController = {
    createPayment,
    stripeWebhook,
    getMyPayments,
    getPaymentDetails
};