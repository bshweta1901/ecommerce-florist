import { PredefinedMaster } from "./PredefinedMaster.model";

export interface Package {
    uuid: string;
    package_uuid: string;
    package_name: string;
    service_type: ServiceType;
    tenure: string;
    maintenance_cycle: PredefinedMaster;
    price: any;
    coverage_details: string;
    turn_around_time: string;
    remarks: string;
    tax: number;
    product_uuid: string;
    selling_price: number;
    standard_price: number;
    itemwise_total_amount: number;
    package_document_id: any;
    package_document: PackageDocument;
    is_delete: boolean;
    is_active: boolean;
    created_at: string;
    modified_at: string;
    created_by: any;
    modified_by: any;
    page: number;
    per_page: number;
    service_type_uuid: string;
    name?: string;
}

export interface ServiceType {
    uuid: string;
    name: string;
    code: string;
    entity_type: string;
}

export interface MaintenanceCycle {
    uuid: string;
    name: string;
    code: string;
    entity_type: string;
}

export interface PackageDocument {
    uuid: any;
    document_name: any;
    file_path: any;
}
