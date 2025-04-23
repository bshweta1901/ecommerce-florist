export class SparePartManager {
    uuid: string;
    spare_part_name: string;
    spare_part_type_name: string;
    spare_part_status_name: any;
    sku: string;
    standard_price: number;
    selling_price: number;
    spare_part_type_uuid: string;
    description: string;
    approx_life: string;
    tax: number;
    spare_part_status_uuid: string;
    search_by: string;
    spare_part_type: any;
    spare_part_status: any;
    page: number;
    per_page: number;
    searchValue;
    page_number: number;
    page_size: number;
    product_type: string;
    is_active: boolean;
    product_category_uuid: string;
    product_category: any;
    is_delete: boolean;
    created_at: string;
    modified_at: string;
    created_by: any;
    modified_by: any;
}

export class ProductTypeDropDown {
    product_type: string;
    uuid: string;
    is_delete: boolean;
    is_active: boolean;
    created_at: string;
    modified_at: string;
    created_by: any;
    modified_by: any;
}

// export class UpdateSparePart {
//     spare_part_name: string;
//     spare_part_type_uuid: string;
//     sku: string;
//     description: string;
//     approx_life: string;
//     standard_price: number;
//     selling_price: number;
//     tax: number;
//     spare_part_status_uuid: string;
// }
