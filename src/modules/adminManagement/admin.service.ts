import { prisma } from "../../lib/prisma";
import { IUpdateUserStatusPayload } from "./admin.interface";

const getAllUsersFromDB = async () => {
    const users = await prisma.user.findMany({
        omit: { password: true },
        orderBy: { createdAt: "desc" }
    });

    return users;
};

const updateUserStatusIntoDB = async (userId: string, payload: IUpdateUserStatusPayload) => {
    const updatedUser = await prisma.user.update({
        where: { user_id: userId },
        data: { activeStatus: payload.activeStatus },
        omit: { password: true }
    });

    return updatedUser;
};

const getAllGearsFromDB = async () => {
    const gearList = await prisma.gearItems.findMany({
        include: {
            category: true,
            provider: { select: { user_id: true, name: true, email: true } }
        },
        orderBy: { createdAt: "desc" }
    });
    console.log(gearList);

    return gearList;
};

const getAllRentalsFromDB = async () => {
    const rentals = await prisma.rentOrders.findMany({
        include: {
            item: true,
            customer: { select: { user_id: true, name: true, email: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    return rentals;
};

export const adminService = {
    getAllUsersFromDB,
    updateUserStatusIntoDB,
    getAllGearsFromDB,
    getAllRentalsFromDB
};