export class LegalEntity {
    uuid: string;
    name: any;
    gst_number: any;
    pan_number: any;
    financial_year: any;
    roc_number: any;
    tds_number: any;
    branches_associated: any[];
    subsidiary_associated: any[];
    branches: any[];
    subsidiaries: any[];
    is_active: boolean;
    is_delete: boolean;
    modified_at: any;
    modified_by: any;
    created_at: any;
    created_by: any;
    search_by: string;
    page: number;
    per_page: number;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    bank_name: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_ifsc_code: string;
    registered_address: RegisteredAddress;
    sign_document: any;
}

export class LegalBranch {
    uuid: string;
    name: string;
    gst_number: string;
    tds_number: string;
    legal_entity_uuid: string;
    legal_entity: any;
    is_active: boolean;
    is_delete: boolean;
    modified_at: any;
    modified_by: any;
    created_at: any;
    created_by: any;
    search_by: string;
    page: number;
    per_page: number;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    bank_name: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_ifsc_code: string;
    registered_address: RegisteredAddress;
    sign_document: any;
}

export class LegalSubsidiary {
    uuid: string;
    name: string;
    gst_number: string;
    pan_number: string;
    financial_year: string;
    roc_number: string;
    tds_number: string;
    registered_address: string;
    legal_entity: any;
    legal_entity_uuid: string;
    is_active: boolean;
    is_delete: boolean;
    modified_at: any;
    modified_by: any;
    created_at: any;
    created_by: any;
    search_by: string;
    page: number;
    per_page: number;
}

export class RegisteredAddress {
    uuid: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}
