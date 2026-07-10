import { prisma } from "../../lib/prisma";

const normalizeCategoryName = (name: string) => {
    return name
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const findOrCreateCategory = async (rawName: string) => {
    const category_name = normalizeCategoryName(rawName);

    const category = await prisma.categories.upsert({
        where: { category_name },
        update: {},
        create: { category_name }
    });

    return category;
};

const getAllCategoriesFromDB = async () => {
    const categories = await prisma.categories.findMany({
        orderBy: { category_name: "asc" }
    });

    return categories;
};

const updateCategoryIntoDB = async (catId: string, rawName: string) => {
    const category_name = normalizeCategoryName(rawName);

    const updated = await prisma.categories.update({
        where: { cat_id: catId },
        data: { category_name }
    });

    return updated;
};

const deleteCategoryFromDB = async (catId: string) => {
    const gearUsingCategory = await prisma.gearItems.findFirst({
        where: { category_id: catId }
    });

    if (gearUsingCategory) {
        throw new Error("Cannot delete a category that is still assigned to gear items");
    }

    return prisma.categories.delete({ where: { cat_id: catId } });
};


export const categoryService = {
    getAllCategoriesFromDB,
    normalizeCategoryName,
    findOrCreateCategory,
    updateCategoryIntoDB,
    deleteCategoryFromDB

}