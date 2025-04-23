export class ServiceRequestMaster {
    uuid: string;
    ref_id: number;
    status_uuid: string;
    customer_uuid: string;
    account_name: string;
    phone: string;
    product_type: string;
    service_type: string;
    location: string;
    status: string;
    service_date: string;
    start_time: string;
    product_name: string;
    serial_no: string;
    package_name: string;
    tenure: string;
    service_cycle: string;
    service_person: string;
    due_date: string;
    turn_around_time: string;
    spoc_phone: string;
    viewForServiceRequest: boolean;
    reassignForServiceRequest: boolean;
    rescheduleForServiceRequest: boolean;
    search_by: string;
    service_person_uuid: string;
    accepted_in_progress: boolean;
    today: boolean;
    pending: boolean;
    completed: boolean;
    accepted: boolean;
    upcoming: boolean;
    history: boolean;
    today_stats: boolean;
    sla_missed_stats: boolean;
    product_category_uuid: string;
    service_type_uuid: string;
    date: string;
    page: number;
    per_page: number;
    page_number: number;
    searchValue;
    page_size: number;
    name: string;
    start_date: Date;
    end_date: Date;
    location_uuid: string;
    today_unassigned_stats: boolean;
    machine_in_repair_stats: boolean;
    old_spare_parts_not_collected_stats: boolean;
    overdue_sr_stats: boolean;
    title?: any;
    url?: any;
    get getName(): string {
        return `${this.account_name} (${this.ref_id})`;
    }
}

export class ServiceRequestList {
    uuid: string;
    ref_id: number;
    account_name: any;
    spoc_name: string;
    spoc_email: string;
    spoc_phone: string;
    location: string;
    product_type: string;
    service_type: string;
    service_date: string;
    status: string;
    slot_uuid: string;
    start_time: string;
    product_name: string;
    package_name: string;
    tenure: string;
    manager_name: string;
    cycle: string;
    coverage_details: string;
    service_remarks: string;
    sla_reason: any;
    delay_reason: any;
    customer_sign: any;
    service_person_sign: any;
    sop_details: SopDetail[];
    sop_details_string: number;
    doc: Doc[];
    spare_parts: SparePart[];
    spare_parts_string: string;
    product_package_spare_parts: string[];
    service_person_category: string[];
    name?: any;
    customer_spare_part_uuid?: string;
}

export class SopDetail {
    uuid: string;
    checked: boolean;
    remarks: any;
    checked_on: any;
    name: string;
    is_ps_sop: number;
}

export class Doc {
    file_path: string;
    image_set: number;
    date: string;
    remarks: any;
}

export interface SparePart {
    spare_part_name: string;
    sku: string;
    status: string;
    is_old_collected: boolean;
    is_old_received: boolean;
    is_old_status: any;
}

export class ServiceEngineerList {
    uuid: string;
    first_name: string;
    last_name: any;
    email: string;
    phone: string;
    is_active: boolean;
    city: string;
    product_category: string;
    search_by: string;
    page: number;
    per_page: number;
    page_number: number;
    searchValue;
    page_size: number;
    product_category_uuid: string;
    location: string;
    unavailable_engineer_stats: boolean;
}

export class ServiceEngineerMaster {
    uuid: string;
    email: string;
    password: string;
    roles: string[];
    role: string;
    first_name: string;
    last_name: string;
    phone: string;
    gender: string;
    dob: string;
    is_active: boolean;
    manager_uuid: string;
    product_category_uuids: string[];
    product_category_uuid: string;
    allowed_discount: string;
    slot_uuids: string[];
    slot_id: string;
    ctc: string;
    employee_id: string;
    cost_allocated: string;
    module_access: ModuleAccess;
    addresses: Addresses;
    address_1: string;
    address_2: string;
    city: string;
    city_type: string;
    state: string;
    zone_uuid: string;
    pincode: string;
    username: string;
    zone_name: any;
    product_category_name: string[];
    modules: {};
    slots: string[];
    manager_name?: string;
}

export class ModuleAccess {
    order: boolean;
    service_request: boolean;
    customer: boolean;
}

export class Addresses {
    address_1: string;
    address_2: string;
    city: string;
    city_type: string;
    state: string;
    zone_uuid: string;
    pincode: string;
}

export class ServiceRequestStats {
    scheduled_services: number;
    sla_missed: number;
}

export class RoleServiceEngineer {
    id: string;
    name: string;
    code: string;
    description: string;
}

export type ServiceDetailsActivity = Details[];

export class Details {
    date: string;
    activity: string[];
}

export class ServicePerson {
    uuid: string;
    first_name: string;
    last_name: any;
    email: string;
    dob: string;
    gender: string;
    city: string;
    employee_id: string;
    allowed_discount: number;
    cost_allocated: any;
    manager_uuid: any;
}

export class AssigneServiceRequest {
    customer_uuid: string;
    customer_contract_itemwise_uuid: string;
    product_uuid: string;
    package_uuid: string;
    location_uuid: string;
    service_person_uuid: string;
    service_date: string;
    service_type_uuid: string;
    due_date: string;
    status_uuid: string;
    reason_for_rejection: string;
    reschedule_request: string;
    send_to_warehouse_remarks: string;
    send_from_warehouse_remarks: string;
    received_spare_part_date: string;
    service_complete_date: string;
    delay_reason: string;
    sla_reason: string;
    rejected: boolean;
    assigned: boolean;
    update_pending_status: boolean;
}

export class RescheduleServiceRequest {
    service_date: string;
    slot_uuid: string;
    is_reschedule: boolean;
}

export class UpdateEngineerRequest {
    user_uuid: string;
    date: string;
    is_accepted: boolean;
    is_rejected: boolean;
    slot_uuid: string;
    service_request_uuid: string;
    status: string;
}

export class SlotMaster {
    slot_name: string;
    start_time: any;
    end_time: any;
    uuid: string;
    slot_id: string;
    is_delete: boolean;
    is_active: boolean;
    created_at: string;
    modified_at: string;
    created_by: any;
    modified_by: any;
    search_by: string;
    label: any;
    page: number;
    per_page: number;
}
