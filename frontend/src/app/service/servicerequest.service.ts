import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { SessionClient } from "../configuration/sessionclientstorage";
import { CustomerCategory } from "src/app/demo/domain/customer";
import {
    RescheduleServiceRequest,
    ServiceEngineerList,
    ServiceRequestList,
    ServiceRequestMaster,
    SlotMaster,
} from "../model/ServiceRequest.model";
import { SparePartManager } from "../model/SparePartMaster.model";
import { OrderDetailsMaster } from "../model/OrderDetails.model";

const httpOptions_FILE = {
    headers: new HttpHeaders({
        "Content-Type": "Application/json; charset=UTF-8",
    }),
    responseType: "blob" as "blob",
};

@Injectable({
    providedIn: "root",
})
export class ServiceRequestService {
    constructor(
        private http: HttpClient,
        private sessionClient: SessionClient
    ) {}
    serviceRequest: ServiceRequestMaster = new ServiceRequestMaster();

    getServiceRequest(service: ServiceRequestMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/service-request/list",
            service
        );
    }

    getServiceRequestList(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/service-request/${uuid}/technical-details`
        );
    }

    getServiceSparePartList(orderDetail: OrderDetailsMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/customer-invoice/list`,
            orderDetail
        );
    }

    saveAssigne(fd: FormData, uuid: string): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/service-request/${uuid}`,
            fd
        );
    }

    updateSparePartStatus(fd: FormData, uuid: string): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/customer-spare-part/${uuid}`,
            fd
        );
    }

    saveReschedule(
        uuid: string,
        reschedule: RescheduleServiceRequest
    ): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/service-request/${uuid}/reassign-reschedule`,
            reschedule
        );
    }
    getServiceEngineerList(serviceEng: ServiceEngineerList): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/service-person/list`,
            serviceEng
        );
    }

    statusForServiceEngineer(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/service-person/change-status/${uuid}`
        );
    }

    getServiceEngineerCount(serviceEng: ServiceEngineerList): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/service-person/count`,
            serviceEng
        );
    }

    exportServiceEngineerList(
        exportServiceEngineer: ServiceEngineerList
    ): Observable<any> {
        return this.http.post(
            environment.apiUrl + `/service-person/export-excel`,
            exportServiceEngineer,
            httpOptions_FILE
        );
    }

    getRole(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + `/user/roles`);
    }

    getSlot(slot: SlotMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/masters/list-slot`,
            slot
        );
    }

    deleteServiceEngineer(uuid: string) {
        return this.http.delete(environment.apiUrl + "/service-person/" + uuid);
    }

    // servicePerson : ServiceRequestMaster
    saveServiceEngineer(fd: FormData): Observable<any> {
        return this.http.post<any>(environment.apiUrl + `/service-person/`, fd);
    }

    getSparePartManagerList(
        sparePartMaster: SparePartManager
    ): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/spare-part/list`,
            sparePartMaster
        );
    }

    getSparePartManagerCount(
        sparePartMaster: SparePartManager
    ): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/spare-part/count`,
            sparePartMaster
        );
    }

    getSparePartDetails(uuid: string): Observable<any> {
        return this.http.get<any>(environment.apiUrl + `/spare-part/${uuid}`);
    }

    deleteSparePartMaster(uuid: string) {
        return this.http.delete(environment.apiUrl + "/spare-part/" + uuid);
    }

    exportSparePartList(exportSparePart: SparePartManager): Observable<any> {
        return this.http.post(
            environment.apiUrl + `/spare-part/export-excel`,
            exportSparePart,
            httpOptions_FILE
        );
    }

    getProductType(sparePart: SparePartManager): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/masters/list-product-type`,
            sparePart
        );
    }

    saveProductTypes(spare: SparePartManager): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/masters/create-product-type`,
            spare
        );
    }

    updateProductType(uuid: string, spare: SparePartManager): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/masters/update-product-type/${uuid}`,
            spare
        );
    }

    deleteProductType(uuid: string): Observable<any> {
        return this.http.delete<any>(
            environment.apiUrl + `/masters/delete-product-type/${uuid}`
        );
    }

    saveSparePartManager(fd: FormData): Observable<any> {
        return this.http.post<any>(environment.apiUrl + "/spare-part/", fd);
    }

    updateSparePartManager(uuid: string, fd: FormData): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/spare-part/${uuid}`,
            fd
        );
    }

    getViewServiceDetails(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/service-request/${uuid}/activity`
        );
    }

    getTechnicalReportDetails(uuid: string): Observable<Blob> {
        return this.http.get(
            environment.apiUrl +
                `/service-request/${uuid}/download-technical-details`,
            {
                responseType: "blob",
            }
        );
    }

    getServiceRequestStats(): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/service-request/stats`
        );
    }

    getServiceRequestCount(service: ServiceRequestMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/service-request/count`,
            service
        );
    }

    exportServiceRequestList(
        exportService: ServiceRequestMaster
    ): Observable<any> {
        return this.http.post(
            environment.apiUrl + `/service-request/export-excel`,
            exportService,
            httpOptions_FILE
        );
    }

    getServiceEngineerRequest(service: ServiceRequestMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/masters/list-unavailability",
            service
        );
    }

    deleteServiceDetails(uuid: string) {
        return this.http.delete(
            environment.apiUrl + "/service-request/" + uuid
        );
    }

    getSlotId(slot: SlotMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/masters/list-slot`,
            slot
        );
    }

    getSoltMaster(slot: SlotMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/masters/list-slot",
            slot
        );
    }

    saveSoltMaster(slot: SlotMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/masters/create-slot`,
            slot
        );
    }

    updateSlotType(uuid: string, slot: SlotMaster): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/masters/update-slot/${uuid}`,
            slot
        );
    }

    deleteSlotById(uuid: string): Observable<any> {
        return this.http.delete<any>(
            environment.apiUrl + `/masters/delete-slot/${uuid}`
        );
    }

    statusForSparePart(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/spare-part/change-status/${uuid}`
        );
    }

    statusForProductType(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/masters/change-product-type-status/${uuid}`
        );
    }

    statusForSlotById(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/masters/change-slot-status/${uuid}`
        );
    }

    getProductTypeCount(sparePart: SparePartManager): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/masters/count-product-type`,
            sparePart
        );
    }

    getSlotTypeCount(customer: CustomerCategory): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/masters/count-slot`,
            customer
        );
    }

    // getCalendarDate(uuid: string): Observable<any> {
    //     return this.http.post<any>(
    //         environment.apiUrl + "/masters/list-unavailability",
    //         uuid
    //     );
    // }
}
