import  httpStatus  from "http-status";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



const registerUser = catchAsync(async (req: Request, res : Response, next: NextFunction) => {

    const payload = req.body;
    const user = await authService.registerUserIntoDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message : "User registered successfully",
        data: { user}
    })

//     res.status(httpStatus.CREATED).json({
//             success: true,
//             statusCode : httpStatus.CREATED,
//             message : "User registered successfully",
//             data: {
//                 user
//             }
// })
})

const loginUser = catchAsync(async (req: Request, res : Response, next: NextFunction) => {
    const payload = req.body;
    const {accessToken, refreshToken} = await authService.loginUser(payload);
    res.cookie("accessToken", accessToken, {
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24 //24 hours or 1 day

    });

      res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24 * 7// 7 day

    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message : "User logged in successfully",
        data: { accessToken, refreshToken }
    })

})

const getMyDetails = catchAsync(async (req: Request, res : Response, next: NextFunction) => {
    

    console.log(req.user, "user request");
    const profile = await authService.getMyProfileFromDB(req.user?.id as string);

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "User profile fetched successfully",
        data: {profile}
    })

})

const updateMyProfile = catchAsync(async (req: Request, res : Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;
    const updatedProfile = await authService.updateMyProfileIntoDB(userId, payload);
     sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "User profile updated successfully",
        data: {updatedProfile}
    })

})

const refreshToken = catchAsync(async (req : Request, res : Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const {accessToken} = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 // 24 hour or 1 day
    })

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "Token Refreshed Successfully",
        data : {
            accessToken
        }
    })
})


export const authController = {
    registerUser,
    loginUser,
    getMyDetails,
    updateMyProfile,
    refreshToken
}