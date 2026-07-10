export interface CreateGearPayload {
    item_name: string;
    description: string;
    brand: string;
    price: number;
    quantity: number;
    category_name: string;
}

export interface UpdateGearPayload {
    item_name?: string;
    description?: string;
    brand?: string;
    price?: number;
    quantity?: number;
    is_active?: boolean;
    category_name?: string;
}

export interface IUpdateOrderStatusPayload {
    order_status: "CONFIRMED" | "CANCELLED" | "PICKED_UP" | "RETURNED";
}