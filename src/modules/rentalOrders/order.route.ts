import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { authGuard } from "../../middleware/authGuard";
import { orderController } from "./order.controller";

const router = Router();

router.get("/", authGuard(Role.CUSTOMER), orderController.getUserOrder)
router.post("/", authGuard(Role.CUSTOMER, Role.PROVIDER), orderController.createOrder)
router.get("/:id", authGuard(Role.CUSTOMER), orderController.getOrderDetails)

export const orderRoutes = router;