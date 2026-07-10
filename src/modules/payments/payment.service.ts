import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import { ICreatePaymentPayload } from "./payment.interface";

const createPaymentIntoDB = async (userId: string, payload: ICreatePaymentPayload) => {
    const { order_id } = payload;

    const order = await prisma.rentOrders.findUniqueOrThrow({
        where: { order_id },
        include: { item: true }
    });

    if (order.customer_id !== userId) {
        throw new Error("You are not authorized to pay for this order");
    }

    const existingCompleted = await prisma.payment.findFirst({
        where: { order_id, status: "COMPLETED" }
    });

    if (existingCompleted) {
        throw new Error("This order has already been paid for");
    }

    const amountInCents = Math.round(Number(order.total_amount) * 100);

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: order.item.item_name
                    },
                    unit_amount: amountInCents
                },
                quantity: 1
            }
        ],
        metadata: {
            order_id: order.order_id
        },
        success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.app_url}/payment/cancel`
    });

    const payment = await prisma.payment.create({
        data: {
            order_id,
            transaction_id: session.id,
            amount: order.total_amount,
            method: "card",
            provider: "Stripe",
            status: "PENDING"
        }
    });

    return {
        payment,
        checkoutUrl: session.url
    };
};

const handleStripeWebhook = async (payload: Buffer, signature: string) => {
    let event;
    const endpointSecret = config.stripe_webhook_secret;
    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            endpointSecret
        );
    } catch (err) {
        throw new Error("Webhook signature verification failed");
    }
    console.log("event after try catch", event.type);

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as { id: string };
        console.log("Is session completed being triggered?",session);

        await prisma.payment.update({
            where: { transaction_id: session.id },
            data: {
                status: "COMPLETED",
                paidAt: new Date()
            }
        });
    }

    if (event.type === "checkout.session.expired") {
        const session = event.data.object as { id: string };
        console.log(session);

        await prisma.payment.update({
            where: { transaction_id: session.id },
            data: { status: "FAILED" }
        });
    }

    return { received: true };
};

const getMyPaymentsFromDB = async (userId: string) => {
    const payments = await prisma.payment.findMany({
        where: { order: { customer_id: userId } },
        include: { order: true },
        orderBy: { createdAt: "desc" }
    });

    return payments;
};

const getPaymentDetailsFromDB = async (paymentId: string, userId: string) => {
    const payment = await prisma.payment.findUniqueOrThrow({
        where: { payment_id: paymentId },
        include: { order: true }
    });

    if (payment.order.customer_id !== userId) {
        throw new Error("You are not authorized to view this payment");
    }

    return payment;
};

export const paymentService = {
    createPaymentIntoDB,
    handleStripeWebhook,
    getMyPaymentsFromDB,
    getPaymentDetailsFromDB
};