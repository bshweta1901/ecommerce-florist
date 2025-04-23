import { PredefinedMaster } from "./PredefinedMaster.model"

export class ReceiptMaster {
    customer_invoice_uuid: string
    payment_date: string
    amount: number
    receipt_status_uuid: string
    receipt_status:PredefinedMaster
    mode_of_payment: string
    transaction_details: string
    remarks: string
    invoice_uuid:string
}
