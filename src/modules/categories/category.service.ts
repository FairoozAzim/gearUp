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


export const categoryService = {
    getAllCategoriesFromDB,
    normalizeCategoryName,
    findOrCreateCategory

}