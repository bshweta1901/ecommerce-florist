import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SessionClient } from "../configuration/sessionclientstorage";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AddOnDemand, OrderDetailsMaster } from "../model/OrderDetails.model";
import { ReceiptMaster } from "../model/receipt.model";

const httpOptions_FILE = {
    headers: new HttpHeaders({
        "Content-Type": "Application/json; charset=UTF-8",
    }),
    responseType: "blob" as "blob",
};

@Injectable({
    providedIn: "root",
})
export class OrderDetails {
    constructor(
        private http: HttpClient,
        private sessionClient: SessionClient
    ) {}

    getOrderDetailsList(orderDetail: OrderDetailsMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/customer-invoice/list",
            orderDetail
        );
    }

    exportOrderDetails(orderDetail: OrderDetailsMaster): Observable<any> {
        return this.http.post(
            environment.apiUrl + "/customer-invoice/export-excel",
            orderDetail,httpOptions_FILE
        );
    }

    getOrderDetailsCount(orderDetail: OrderDetailsMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/customer-invoice/count",
            orderDetail
        );
    }

    saveAddSparePart(fd: FormData): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/customer-spare-part/`,
            fd
        );
    }

    saveAddOnDemand(demand: AddOnDemand): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/service-request/create-on-demand-service`,
            demand
        );
    }

    saveUpdateStatus(fd: FormData, uuid: string): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/customer-invoice/${uuid}`,
            fd
        );
    }

    getReceiptList(receipt: ReceiptMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/customer-invoice/receipt/list",receipt,
        );
    }

    saveReceipt(receipt: ReceiptMaster){
        return this.http.post<any>(
            environment.apiUrl + "/customer-invoice/receipt",receipt
        );
    }

}
