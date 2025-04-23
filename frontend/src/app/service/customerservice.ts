import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SessionClient } from "../configuration/sessionclientstorage";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { Notification } from "../model/Notification.model";
import { AuthService } from "./auth.service";
import { Address, Customer, CustomerCategory } from "../demo/domain/customer";
import { Contract, ContractItem } from "../model/Contract.model";
import { ServiceRequestMaster } from "../model/ServiceRequest.model";

const httpOptions_FILE = {
    headers: new HttpHeaders({
        "Content-Type": "Application/json; charset=UTF-8",
    }),
    responseType: "blob" as "blob",
};

@Injectable({ providedIn: "root" })
export class CustomerService {
    notification: Notification = new Notification();

    constructor(
        private http: HttpClient,
        private sessionClient: SessionClient,
        public authService: AuthService
    ) {}

    getCustomerList(customer: Customer): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/user/list",
            customer
        );
    }
    getCustomerById(id: String): Observable<any> {
        return this.http.get<any>(environment.apiUrl + "/customer/" + id);
    }

    exportCustomers(customer: Customer) {
        return this.http.post(
            environment.apiUrl + "/customer/export-excel",
            customer,
            httpOptions_FILE
        );
    }

    getCustomerManagementCount(customer: Customer): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/customer/count`,
            customer
        );
    }

    saveCustomer(fd: FormData) {
        return this.http.post(environment.apiUrl + "/customer/", fd);
    }

    updateCustomer(uuid: string, fd: FormData) {
        return this.http.put(environment.apiUrl + "/customer/" + uuid, fd);
    }

    getCustomerCategory(customer: CustomerCategory) {
        return this.http.post(
            environment.apiUrl + "/masters/list-customer-category",
            customer
        );
    }

    saveAddress(address: Address) {
        return this.http.post(
            environment.apiUrl + "/user-address/address-save",
            address
        );
    }

    updateAddress(id: string, address: Address) {
        return this.http.put(
            environment.apiUrl + "/user-address/update/" + id,
            address
        );
    }

    deleteAddress(address: Address) {
        return this.http.delete(
            environment.apiUrl + "/user-address/delete/" + address.uuid
        );
    }

    signAgreement(uuid: string, sign: string) {
        let fd = new FormData();
        fd.append("uuid", uuid);
        const blob = this.base64ToBlob(sign.split(",")[1], "image/jpeg");
        fd.append("document", blob, "signature.jpg");

        return this.http.post(
            environment.apiUrl + "/customer-contract/" + uuid + "/sign",
            fd
        );
    }

    private base64ToBlob(base64: string, contentType: string): Blob {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    }

    updateCustomerCategory(uuid: string, customerCategory: CustomerCategory) {
        return this.http.put(
            environment.apiUrl + "/masters/update-customer-category/" + uuid,
            customerCategory
        );
    }

    deleteCustomerCategory(uuid: string) {
        return this.http.delete(
            environment.apiUrl + "/masters/delete-customer-category/" + uuid
        );
    }

    deleteClientNameDetails(uuid: string) {
        return this.http.delete(
            environment.apiUrl + "/masters/delete-customer-category/" + uuid
        );
    }

    deleteProductDetails(uuid: string) {
        return this.http.delete(
            environment.apiUrl + "/masters/delete-customer-category/" + uuid
        );
    }

    deleteContractDetails(uuid: string) {
        return this.http.delete(
            environment.apiUrl + "/masters/delete-customer-category/" + uuid
        );
    }

    getCustomerContractById(contractId: string) {
        return this.http.get(
            environment.apiUrl + "/customer-contract/" + contractId
        );
    }

    getCustomerContractList(contract: Contract) {
        return this.http.post(
            environment.apiUrl + "/customer-contract/list",
            contract
        );
    }
    getCustomerContractItemList(contractId: string) {
        return this.http.get(
            environment.apiUrl + "/customer-contract/itemwise/" + contractId
        );
    }

    deleteCustomer(customerUUID: string) {
        return this.http.delete(
            environment.apiUrl + "/customer/" + customerUUID
        );
    }
    changeStatus(customerUUID: string) {
        return this.http.get(
            environment.apiUrl + "/customer/change-status/" + customerUUID
        );
    }
    updateContract(contractUUID: string, formData: FormData) {
        return this.http.put(
            environment.apiUrl + "/customer-contract/" + contractUUID,
            formData
        );
    }

    itemContractUpdate(contractUUID: string, contract: ContractItem) {
        return this.http.put(
            environment.apiUrl + "/customer-contract/itemwise/" + contractUUID,
            contract
        );
    }

    getServiceRequestList(serviceRequest: ServiceRequestMaster) {
        return this.http.post(
            environment.apiUrl + "/service-request/list",
            serviceRequest
        );
    }
    createCustomerContract(contract: Contract) {
        let fd = new FormData();
        fd.append("data", JSON.stringify(contract));
        return this.http.post(environment.apiUrl + "/customer-contract/", fd);
    }

    saveCustomerType(customerCategory: CustomerCategory): Observable<any> {
        return this.http.post(
            environment.apiUrl + "/masters/create-customer-category",
            customerCategory
        );
    }

    getNotificationList(notification: Notification): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/notification/list-notification",
            notification
        );
    }

    getNotificationCount(notification: Notification): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/notification/count-notification",
            notification
        );
    }

    readNotification(id: String): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + "/notification/mark-read-notification/" + id
        );
    }

    deleteContractDetail(customerUUID: string) {
        return this.http.delete(
            environment.apiUrl + `/customer-contract/${customerUUID}`
        );
    }

    statusForCustomerCategory(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl +
                `/masters/change-customer-category-status/${uuid}`
        );
    }

    statusForAddress(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/user-address/change-status/${uuid}`
        );
    }

    statusForContract(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/customer-contract/change-status/${uuid}`
        );
    }

    getCustomerCategoryCount(customer: CustomerCategory) {
        return this.http.post(
            environment.apiUrl + "/masters/count-customer-category",
            customer
        );
    }
}
