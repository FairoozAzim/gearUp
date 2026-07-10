import { Router } from "express";
import { adminController } from "./admin.controller";
import { Role } from "../../../generated/prisma/enums";
import { authGuard } from "../../middleware/authGuard";

const router = Router();

router.get("/users", authGuard(Role.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", authGuard(Role.ADMIN), adminController.updateUserStatus);
router.get("/gear", authGuard(Role.ADMIN), adminController.getAllGear);
router.get("/rentals", authGuard(Role.ADMIN), adminController.getAllRentals);

export const adminRoutes = router;