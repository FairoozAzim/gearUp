import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categories = await categoryService.getAllCategoriesFromDB();
    console.log(categories);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Categories fetched successfully",
        data: { categories }
    });
});

const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { category_name } = req.body;
    const category = await categoryService.updateCategoryIntoDB(id as string, category_name);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category updated successfully",
        data: { category }
    });
});

const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await categoryService.deleteCategoryFromDB(id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category deleted successfully",
        data: null
    });
});


export const categoryController = {
    getAllCategories,
    updateCategory,
    deleteCategory
}