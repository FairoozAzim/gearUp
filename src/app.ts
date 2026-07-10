import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
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
import { paymentController } from "./modules/payments/payment.controller";

const app: Application = express();

// middlewares

app.use(cors(
    {
        origin : config.app_url,
         credentials: true,

}))

// Stripe webhook needs the RAW body — must be registered BEFORE express.json()
app.use( "/api/payments/webhook", express.raw({ type: "application/json" }));

// just for testing/demo purposes
app.get("/payment/success", (req, res) => {
    res.send("Payment successful! You can close this tab.");
});
app.use(express.json());

app.use(express.urlencoded({extended : true}));

app.use(cookieParser());

// api endpoints

app.get("/", (req : Request, res : Response) => {
    res.send("Gear Up!!!")
})

app.use("/api/auth", authRoutes);
app.use("/api/gear", gearRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/rentals", orderRoutes);
app.use("/api/payments", paymentRoutes);

export default app;