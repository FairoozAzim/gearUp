import { prisma } from "../../lib/prisma";
import { CreateGearPayload, UpdateGearPayload } from "./provider.interface";
import { categoryService }  from "../categories/category.service";



const createGearIntoDB = async (providerId: string, payload: CreateGearPayload) => {
    const { category_name, ...gearData } = payload;

    const category = await categoryService.findOrCreateCategory(category_name);

    const gear = await prisma.gearItems.create({
        data: {
            ...gearData,
            category_id: category.cat_id,
            provider_id: providerId,
            available_quantity: payload.quantity,
            is_active: true
        }
    });

    return gear;
};

const getMyGearFromDB = async (providerId: string) => {
    const gearList = await prisma.gearItems.findMany({
        where: { provider_id: providerId },
        include: { category: true }
    });

    return gearList;
};

const updateGearIntoDB = async (
    providerId: string,
    itemId: string,
    payload: UpdateGearPayload) => {
        
    const gear = await prisma.gearItems.findUniqueOrThrow({
        where: { item_id: itemId }
    });

    if (gear.provider_id !== providerId) {
        throw new Error("You are not authorized to update this gear item");
    }

    const { category_name, ...rest } = payload;

    let category_id: string | undefined;
    if (category_name) {
        const category = await categoryService.findOrCreateCategory(category_name);
        category_id = category.cat_id;
    }

    const updatedGear = await prisma.gearItems.update({
        where: { item_id: itemId },
        data: {
            ...rest,
            ...(category_id && { category_id })
        }
    });

    return updatedGear;
};

const deleteGearFromDB = async (providerId: string, itemId: string) => {
    const gear = await prisma.gearItems.findUniqueOrThrow({
        where: { item_id: itemId }
    });

    if (gear.provider_id !== providerId) {
        throw new Error("You are not authorized to delete this gear item");
    }

    const deletedGear = await prisma.gearItems.update({
        where: { item_id: itemId },
        data: { is_active: false }
    });

    return deletedGear;
};


export const providerService = {
    createGearIntoDB,
    getMyGearFromDB,
    updateGearIntoDB,
    deleteGearFromDB
};