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

const app: Application = express();

// middlewares

app.use(cors(
    {
        origin : config.app_url,
         credentials: true,

}))

app.use(express.json());

app.use(express.urlencoded({extended : true}));

app.use(cookieParser());

// api endpoints

app.get("/", (req : Request, res : Response) => {
    res.send("Gear Up!!!")
})

app.use("/api/auth", authRoutes);
app.use("/api/gear", gearRoutes);
app.use("/api/provider", providerRoutes)

export default app;