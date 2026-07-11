import { prisma } from "../../lib/prisma";
import { GearFilters } from "./gear.interface";


const getAllGearFromDB = async (filters: GearFilters) => {
    const { category_id, brand, minPrice, maxPrice, searchTerm, availability } = filters;

    const gearList = await prisma.gearItems.findMany({
        where: {
            is_active: true,
            ...(category_id && { category_id }),
            ...(brand && { brand: { equals: brand, mode: "insensitive" } }),
            ...(searchTerm && {
                item_name: { contains: searchTerm, mode: "insensitive" }
            }),
            ...((minPrice || maxPrice) && {
                price: {
                    ...(minPrice && { gte: Number(minPrice) }),
                    ...(maxPrice && { lte: Number(maxPrice) })
                }
            }),
            ...(availability === "true" && { available_quantity: { gt: 0 } })
        },
        include: {
            category: true,
            provider: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt : "desc"
        }
    });

    return gearList;
};

const getGearByIdFromDB = async (itemId: string) => {
    const gear = await prisma.gearItems.findUniqueOrThrow({
        where: { item_id: itemId, is_active: true },
        include: {
            category: true, 
            provider: {
                select: {
                    name: true
                }
            }
        }
    });

    return gear;
};


//     providerId: string,
//     itemId: string,
//     payload: UpdateGearPayload
// ) => {
//     const gear = await prisma.gearItems.findUniqueOrThrow({
//         where: { item_id: itemId }
//     });

//     if (gear.provider_id !== providerId) {
//         throw new Error("You are not authorized to update this gear item");
//     }

//     const updatedGear = await prisma.gearItems.update({
//         where: { item_id: itemId },
//         data: payload
//     });

//     return updatedGear;
// };

// const deleteGearFromDB = async (providerId: string, itemId: string) => {
//     const gear = await prisma.gearItems.findUniqueOrThrow({
//         where: { item_id: itemId }
//     });

//     if (gear.provider_id !== providerId) {
//         throw new Error("You are not authorized to delete this gear item");
//     }

//     const deletedGear = await prisma.gearItems.update({
//         where: { item_id: itemId },
//         data: { is_active: false }
//     });

//     return deletedGear;
// };

export const gearService = {
    getAllGearFromDB,
    getGearByIdFromDB,
};