import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const createReviewIntoDB = async (userId: string, payload: ICreateReviewPayload) => {
    const { order_id, rating, review } = payload;

    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }

    const order = await prisma.rentOrders.findUniqueOrThrow({
        where: { order_id }
    });

    if (order.customer_id !== userId) {
        throw new Error("You are not authorized to review this order");
    }

    if (order.order_status !== "RETURNED") {
        throw new Error("You can only review an order after the gear has been returned");
    }

    const existingReview = await prisma.reviews.findUnique({
        where: { order_id }
    });

    if (existingReview) {
        throw new Error("You have already reviewed this order");
    }

    const newReview = await prisma.reviews.create({
        data: {
            order_id,
            item_id: order.item_id,
            rating,
            review,
            reviewed_at: new Date()
        }
    });

    return newReview;
};

const getGearReviewsFromDB = async (itemId: string) => {
    const reviews = await prisma.reviews.findMany({
        where: { item_id: itemId },
        orderBy: { reviewed_at: "desc" }
    });

    return reviews;
};

export const reviewService = {
    createReviewIntoDB,
    getGearReviewsFromDB
};