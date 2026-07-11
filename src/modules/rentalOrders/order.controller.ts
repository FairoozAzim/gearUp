import { NextFunction, Request, Response } from "express"
import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync"
import { orderService } from "./order.service";
import { sendResponse } from "../../utils/sendResponse";

const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //user_id: from access token, item_id, quantity, pickup_date, return_date,
    const userId = req.user?.id;
    const payload = req.body;
    const result = await orderService.createOrdersIntoDB(payload, userId as string);

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "Order Placed Successfully",
        data : result
    })


});

const getUserOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const result = await orderService.getMyOrdersFromDB(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Orders fetched successfully",
        data: result
    })
});

const getOrderDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { id } = req.params;
    console.log(id);
    const result = await orderService.getOrderDetailsFromDB(id as string, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Order details fetched successfully",
        data: result
    })
});


export const orderController = {
    createOrder,
    getUserOrder,
    getOrderDetails,
}