import { Router } from "express";

const router = Router();

router.get("/payment/success", (req, res) => {
    res.send("Payment successful! You can close this tab.");
});

router.get("/payment/cancel", (req, res) => {
    res.send("Payment was cancelled. You can close this tab.");
});

export const paymentStatus = router;