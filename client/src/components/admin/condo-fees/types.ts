export interface Payment {
    address: string;
    amount_owed: number;
    amount_paid: number;
    monthly_payment: number;
    months_paid: number;
    special_contribution_paid: boolean;
}

export interface OwnerInfo {
    name: string;
    email: string;
    number: string;
    admin: boolean;
}