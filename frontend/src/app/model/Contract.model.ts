import { PredefinedMaster } from "./PredefinedMaster.model";

export interface UploadEvent {
    originalEvent: Event;
    files: File[];
    currentFiles: File[];
}
export interface Contract {
    contract_itemwise: ContractItem[];
    ccontract_itemwise: ContractItem[];
    customer_uuid: string;
    uuid: string;
    remarks: string;
    payment_frequency_uuid: string;
    payment_frequency: PredefinedMaster;
    contract_status: any;
    contract_status_uuid: string;
    esign_status_uuid: string;
    no_of_invoices: string;
    payment_terms: string;
    billing_address: string;
    billing_city: string;
    billing_state: string;
    billing_pincode: string;
    gstin_no: string;
    tnc: string;
    contract_date: any;
    sent_esign: boolean;
    off_contract_no: string;
    document: any;
    package_uuid: any;
    package_amount: any;
    tax_amount: any;
    itemwise_total_amount: any;
    is_installation_service: any;
    is_amc_camc: any;
    is_ondemand_service: any;
    is_warranty_service: any;
    is_already_signed: boolean;
    is_active: boolean;
    legal_entity_uuid: string;
    branch_uuid: string;
    // subsidiary_uuid: string;
    legal_entity: any;
    branch: any;
    items: any;
}

export interface ContractItem {
    index: number;
    customer_uuid: string;
    customer_product_uuid: string;
    product_uuid: string;
    package_uuid: string;
    is_warrantry_service: boolean;
    is_warrantry_billable: boolean;
    is_amc_camc_service: boolean;
    is_amc_camc: boolean;
    is_ondemand_service: boolean;
    is_installation_service: boolean;
    is_insallation_charges_service: boolean;
    is_warranty_service: boolean;
    installation_date: Date;
    tenure: string;
    start_date: Date;
    end_date: Date;
    coverage_details: string;
    uuid: string;
    package_amount: number;
    discount_percent: number;
    discount_amount: number;
    tax_percent: number;
    tax_amount: number;
    standard_price: number;
    selling_price: number;
    itemwise_total_amount: number;
    product_name: string;
    serial_number: string;
    service_type: string;
    package_name: string;
    turn_around_time: string;
    maintenance_name: string;
    spare_part_covered: any[];
    discount: number;
    spare_part: any[];
    tax: any;
    maintenance_cycle: PredefinedMaster;
}
