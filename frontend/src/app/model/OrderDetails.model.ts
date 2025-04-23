export class OrderDetailsMaster {
    uuid: string;
    customer_invoice_id: string;
    invoice_date: string;
    total_payable: number;
    customer_contract_uuid: any;
    customer_contract_id: any;
    invoice_status?: string;
    package: string;
    account_name: any;
    search_by: string;
    page: number;
    per_page: number;
    page_number: number;
    searchValue;
    page_size: number;
    invoice_status_uuid: string;
    financial_year: number;
    current_year: number;
    start_date: string;
    end_date: string;
    package_type: Number;
    pending_spare_part_stats: boolean;
    public customer_uuid: string;
    mode_of_payment?: string;
    name?: string;
    invoice_for_id?: any;
    service_request?: any;
    tax_total?: any;
    remarks?: any;
    spare_part_name?: any;
    subtotal?: any;
    transaction_details?: any;
}

export class AddSparePart {
    service_request_uuid: string;
    spare_part_uuids: string[];
    subtotal: string;
    discount_total: string;
    tax_total: string;
    total_payable: string;
    new_serial_no: string;
    old_serial_no: string;
    send_for_approval: boolean;
    uuid: string;
    spare_part_name: string;
    spare_part_type_name: string;
    spare_part_status_name: any;
    sku: string;
    standard_price: number;
    selling_price: number;
    tax: string;
}

export class AddOnDemand {
    service_request_uuid: string;
    spare_part_uuids: string[];
    subtotal: string;
    discount: string;
    discount_total: string;
    tax_total: string;
    total_payable: string;
    new_serial_no: string;
    old_serial_no: string;
    send_for_approval: boolean;
    service_person_uuid: string;
    customer_uuid: string;
    service_date: string;
    slot_uuid: string;
    service_remarks: string;
    status_uuid: string;
}

export class UpdateCustomerInvoice {
    invoice_for: string;
    customer_contract_uuid: string;
    service_request_uuid: string;
    invoice_date: string;
    off_invoice_no: string;
    invoice_status_uuid: string;
    subtotal: string;
    discount_total: string;
    tax_total: string;
    total_payable: string;
    payment_terms: string;
    tnc: string;
    remarks: string;
    mode_of_payment: string;
    transaction_details: string;
    name: string;
    uuid: string;
    no_of_receipt: any;
}
