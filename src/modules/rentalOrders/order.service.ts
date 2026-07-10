import { prisma } from "../../lib/prisma";
import { ICreateOrderPayload } from "./order.interface";

const createOrdersIntoDB = async (payload: ICreateOrderPayload, userId: string) => {
    const { item_id, quantity, pickup_date, return_date } = payload;

    const item = await prisma.gearItems.findUniqueOrThrow({
        where: { item_id },
        select: { price: true, available_quantity: true, provider_id: true, is_active: true }
    });

    if (!item.is_active) {
        throw new Error("This item is no longer available");
    }

    if (item.provider_id === userId) {
        throw new Error("You cannot rent your own gear item");
    }

    if (quantity > item.available_quantity) {
        throw new Error("Requested quantity exceeds available stock");
    }

    const start = new Date(pickup_date);
    const end = new Date(return_date);

    if (end <= start) {
        throw new Error("End date must be after pickup date");
    }

    if (start < new Date(new Date().toDateString())) {
        throw new Error("Pickup date cannot be in the past");
    }

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const total_amount = item.price.times(days).times(quantity);

    const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.rentOrders.create({
            data: {
                customer_id: userId,
                item_id,
                quantity,
                total_amount,
                pickup_date : start,
                return_date: end
               
            }
        });

        await tx.gearItems.update({
            where: { item_id },
            data: { available_quantity: { decrement: quantity } }
        });

        return newOrder;
    });

    return order;
};

const getMyOrdersFromDB = async (userId: string) => {
    const orders = await prisma.rentOrders.findMany({
        where: { customer_id: userId },
        include: {
            item: {
                select: { item_name: true, brand: true, price: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return orders;
};

const getOrderDetailsFromDB = async (orderId: string, userId: string) => {
    const order = await prisma.rentOrders.findUniqueOrThrow({
        where: { order_id: orderId },
        include: {
            item: true,
            user: {
                select: { user_id: true, name: true, email: true }
            }
        }
    });

    const isOwner = order.customer_id === userId;
    const isProvider = order.item.provider_id === userId;

    if (!isOwner && !isProvider) {
        throw new Error("You are not authorized to view this order");
    }

    return order;
};

export const orderService = {
    createOrdersIntoDB,
    getMyOrdersFromDB,
    getOrderDetailsFromDB
};