import { Router } from "express";
import { authController } from "./auth.controller";
import { Role } from "../../../generated/prisma/enums";
import { authGuard } from "../../middleware/authGuard";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshToken);

router.get("/me", authGuard(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER), authController.getMyDetails);

router.put("/editProfile", authGuard(Role.ADMIN, Role.CUSTOMER,Role.PROVIDER), authController.updateMyProfile);


export const authRoutes = router;