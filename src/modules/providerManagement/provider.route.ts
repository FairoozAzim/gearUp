import { Router } from "express";
import { providerController } from "./provider.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/gear", auth(Role.PROVIDER), providerController.createGear);
router.get("/gear", auth(Role.PROVIDER), providerController.getMyGear);
router.put("/gear/:id", auth(Role.PROVIDER), providerController.updateGear);
router.delete("/gear/:id", auth(Role.PROVIDER), providerController.deleteGear);

export const providerRoutes = router;