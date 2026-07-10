export interface ICreatePaymentPayload {
    order_id: string;
    method: string;
    provider: "STRIPE" | "SSLCOMMERZ";
}

export interface IConfirmPaymentPayload {
    transaction_id: string;
    provider_reference_id?: string;
    status: "COMPLETED" | "FAILED";
}