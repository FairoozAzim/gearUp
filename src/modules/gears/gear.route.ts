import { Router } from "express";
import { gearController } from "./gear.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

// Public
router.get("/", gearController.getAllGear);
router.get("/:id", gearController.getGearById);



export const gearRoutes = router;