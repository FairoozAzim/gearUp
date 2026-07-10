import { Router } from "express";
import express from "express";
import { paymentController } from "./payment.controller";
import { Role } from "../../../generated/prisma/enums";
import { authGuard } from "../../middleware/authGuard";

const router = Router();

router.post("/create", authGuard(Role.CUSTOMER, Role.PROVIDER), paymentController.createPayment);

// Stripe webhook needs the RAW request body to verify the signature —
// must NOT go through express.json() first
router.post(
    "/webhook", paymentController.stripeWebhook
);

router.get("/", authGuard(Role.CUSTOMER, Role.PROVIDER), paymentController.getMyPayments);
router.get("/:id", authGuard(Role.CUSTOMER, Role.PROVIDER), paymentController.getPaymentDetails);


export const paymentRoutes = router;