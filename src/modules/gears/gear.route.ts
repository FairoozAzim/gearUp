import { Router } from "express";
import { gearController } from "./gear.controller";


const router = Router();

// Public
router.get("/", gearController.getAllGears);
router.get("/:id", gearController.getGearById);



export const gearRoutes = router;