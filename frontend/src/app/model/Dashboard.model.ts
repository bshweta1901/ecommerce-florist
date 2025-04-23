export class InstallationMaster {
    total_installation_count: number;
    pending_installation_count: number;
    overdue_installation_count: number;
    total_amount_due: number;
    total_pending_amount_due: number;
    total_overdue_amount_due: number;
}

export class MachineStatusMaster {
    total_installation_base: number;
    machine_under_amc_camc: number;
    machine_not_under_amc_camc: number;
    machine_end_of_life: number;
}

export class ContractStatusMaster {
    renewals_today: number;
    renewal_amount_today: number;
    renewals_next_10_days: number;
    renewal_amount_next_10_days: number;
    renewals_next_30_days: number;
    renewal_amount_next_30_days: number;
}

export class ServiceRequestSlaMaster {
    service_closed: number;
    service_overdue: number;
    service_for_amc_camc: number;
    installation_on_time: number;
    installation_on_time_percentage:number;
    service_closed_percentage:number;
    service_for_amc_camc_percentage:number;
    service_overdue_percentage:number;
}

export class InvoiceMaster {
    customer_contract_count: number;
    customer_contract_total: number;
    invoice_pending_count: number;
    invoice_pending_total: number;
    invoice_passed_count: number;
    invoice_passed_total: number;
}
