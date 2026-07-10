import { Router } from "express";
import { reviewController } from "./review.controller";
import { Role } from "../../../generated/prisma/enums";
import { authGuard } from "../../middleware/authGuard";

const router = Router();

router.post("/", authGuard(Role.CUSTOMER, Role.PROVIDER), reviewController.createReview);
router.get("/gear/:itemId", reviewController.getGearReviews); // public

export const reviewRoutes = router;