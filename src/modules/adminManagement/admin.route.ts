import { Router } from "express";
import { adminController } from "./admin.controller";
import { Role } from "../../../generated/prisma/enums";
import { authGuard } from "../../middleware/authGuard";

const router = Router();

router.get("/users", authGuard(Role.ADMIN), adminController.getAllUsers);
router.get("/gears", authGuard(Role.ADMIN), adminController.getAllGears);
router.get("/rentals", authGuard(Role.ADMIN), adminController.getAllRentals);
router.patch("/users/:id", authGuard(Role.ADMIN), adminController.updateUserStatus);


export const adminRoutes = router;