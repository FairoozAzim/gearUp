import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import config from "./config";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import {authRoutes } from "./modules/authentication/auth.route";
import { gearRoutes } from "./modules/gears/gear.route";
import { providerRoutes } from "./modules/providerManagement/provider.route";
import { categoryRoutes } from "./modules/categories/category.route";
import { orderRoutes } from "./modules/rentalOrders/order.route";
import { paymentRoutes } from "./modules/payments/payment.route";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { reviewRoutes } from "./modules/reviews/review.route";
import { adminRoutes } from "./modules/adminManagement/admin.route";

const app: Application = express();

// middlewares

app.use(cors(
    {
        origin : config.app_url,
        credentials: true,

}))

// Stripe webhook
app.use( "/api/payments/webhook", express.raw({ type: "application/json" }));
app.get("/payment/success", (req, res) => {
    res.send("Payment successful! You can close this tab.");
});
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

// api endpoints

app.get("/", (req : Request, res : Response) => {
    res.send("Welcome to the world of sport gears!")
})

app.use("/api/auth", authRoutes);
app.use("/api/gears", gearRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/rentals", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(globalErrorHandler);
 
export default app;