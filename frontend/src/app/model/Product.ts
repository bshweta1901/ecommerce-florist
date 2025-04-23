export class Product {
    uuid: string;
    product_category_uuid: string;
    sku: string;
    description: string;
    approx_life: any = "";
    sap_oracle_code: string;
    per_page: number;
    page: 1;
    product_name: string;
}

export class ProductCategory {
    product_category_uuid: string;
    uuid: string;
    product_category: string;
    ps_sops: PsSop;
    pss: string[];
    pss_string: string;
    sops: string[];
    sops_string: string;
    name: string;
    code: string;
    remarks: string;
    entity_type: string;
    addRepairChecklist: boolean;
    per_page: number;
    page: 1;
    is_delete?: string;
    created_at?: string;
    created_by?: string;
    modified_at?: string;
    modified_by?: string;
    is_ps_sop?: any;
    is_active: boolean;
}
export class PsSop {
    pss: string;
    sops: any[];
}

export class CatelogProductMaster {
    uuid: string;
    product_name: string;
    product_category_name: string;
    standard_price: number;
    selling_price: number;
    approx_life: string;
    sap_oracle_code: string;
    search_by: string;
    product_category: ProductCategory;
    sku: string;
    description: string;
    warranty_available: WarrantyAvailable;
    tax: number;
    product_agreement: {
        uuid: any;
        document_name: any;
        file_path: any;
    };
    is_delete: boolean;
    is_active: boolean;
    created_at: string;
    modified_at: string;
    created_by: any;
    modified_by: any;
    product_uuid: string;
    package_name: string;
    service_type_uuid: string;
    tenure: string;
    maintenance_cycle_uuid: string;
    coverage_details: string;
    turn_around_time: string;
    remarks: string;
    spare_parts_uuid: string[];
    page: number;
    per_page: number;
    page_number: number;
    searchValue;
    page_size: number;
    product_category_uuid: string;
    oem_uuid: string;
    oem: any;
    spare_parts: any;
    sop: any;
    product_documents: any;
}

export class WarrantyAvailable {
    uuid: any;
    name: string;
    code: string;
    entity_type: string;
}

// export class ProductAgreement {
//     uuid: any;
//     document_name: any;
//     file_path: any;
// }

export class CreatePackage {
    package_name: string;
    service_type: ServiceType;
    service_type_uuid: string;
    tenure: string;
    spare_part_covered: string[];
    maintenance_cycle: MaintenanceCycle;
    maintenance_cycle_uuid: string;
    standard_price: number;
    selling_price: number;
    tax: number;
    coverage_details: string;
    turn_around_time: string;
    product_uuid: string;
    remarks: any;
    package_document: {
        uuid: any;
        document_name: any;
        file_path: any;
    };
    uuid: string;
    is_delete: boolean;
    is_active: boolean;
    created_at: string;
    modified_at: string;
    created_by: any;
    modified_by: any;
    spare_parts_uuid: string[];
    spare_part: SparePart[];
    field1?: any;
    field2?: any;
    field3?: any;
    url?: any;
    thumbnail?: any;
    code?: any;
    name?: any;
    entity_type?: any;
    parent?: any;
}

export class ServiceType {
    uuid: string;
    name: string;
    code: string;
    entity_type: string;
}

export class MaintenanceCycle {
    uuid: string;
    name: string;
    code: string;
    entity_type: string;
}

// export class PackageDocument {
//     uuid: any;
//     document_name: any;
//     file_path: any;
// }

export class SparePart {
    uuid: string;
    spare_part_name: string;
    spare_part_type_name: string;
    spare_part_status_name: any;
    sku: string;
    standard_price: number;
    selling_price: number;
    tax: any;
}

export class UploadEvent {
    originalEvent: Event;
    files: File[];
    currentFiles: File[];
}
