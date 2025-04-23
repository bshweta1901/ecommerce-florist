export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    gender: string;
    dob: string;
    account_name: string;
    customer_group: string;
    customer_type_uuid: string;
    customer_type: string;
    kyc_no: string;
    uuid: string;
    user_uuid: string;
    addresses: Address[];
    representative?: Representative;
    page_number: 1;
    page_size: 10;
    roles: ["CUSTOMER"];
}

export interface Address {
    uuid: string;
    address_1: string;
    address_2: string;
    city: string;
    city_type: string;
    entity_type: string;
    state: string;
    zone: string;
    zone_uuid: string;
    pincode: string;
    spoc_name: string;
    spoc_email: string;
    spoc_phone: string;
    user_uuid: string;
    city_uuid: string;
    state_uuid: string;
    is_active: boolean;
}

export interface CustomerCategory {
    customer_type: string;
    uuid: string;
    is_delete: boolean;
    is_active: boolean;
    created_at: string;
    modified_at: string;
    created_by: any;
    modified_by: any;
}

export interface CustomerProduct {
    uuid: string;
    product_uuid: string;
    customer_uuid: string;
    location_uuid: string;
    product_name: string;
    sku: number;
    serial_no: string;
    product_serial_number: string;
    start_date_for_life: string;
    per_page: number;
    page: number;
}
