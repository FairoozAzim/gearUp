import { Router } from "express";
import { providerController } from "./provider.controller";
import { Role } from "../../../generated/prisma/enums";
import { authGuard } from "../../middleware/authGuard";

const router = Router();

router.post("/gear", authGuard(Role.PROVIDER), providerController.createGear);
router.get("/gear", authGuard(Role.PROVIDER), providerController.getMyGear);
router.get("/orders", authGuard(Role.PROVIDER), providerController.getProviderOrders);
router.patch("/orders/:id", authGuard(Role.PROVIDER), providerController.updateOrderStatus);
router.put("/gear/:id", authGuard(Role.PROVIDER), providerController.updateGear);
router.delete("/gear/:id", authGuard(Role.PROVIDER), providerController.deleteGear);
router.patch("/order/:id", authGuard(Role.PROVIDER), providerController.updateOrderStatus);

export const providerRoutes = router;