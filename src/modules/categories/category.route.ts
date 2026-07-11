import { Router } from "express";
import { categoryController } from "./category.controller";
import { authGuard } from "../../middleware/authGuard";
import { Role } from "../../../generated/prisma/enums";


const router = Router();
router.get("/", categoryController.getAllCategories);
router.patch("/:id", authGuard(Role.ADMIN), categoryController.updateCategory);
router.delete("/:id", authGuard(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;