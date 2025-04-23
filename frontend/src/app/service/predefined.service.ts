import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SessionClient } from "../configuration/sessionclientstorage";
import { PredefinedMaster } from "../model/PredefinedMaster.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ServiceRequestMaster } from "../model/ServiceRequest.model";

@Injectable({
    providedIn: "root",
})
export class PredefinedService {
    constructor(
        private http: HttpClient,
        private sessionClient: SessionClient
    ) {}

    getPredefinedList(predefined: PredefinedMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "api/predefined/list-by-type",
            predefined
        );
    }

    getPredefinedByTypeAndCode(predefined: PredefinedMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/predefined/by-type-and-code`,
            predefined
        );
    }

    getFilter(filter: PredefinedMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `api/filter/getFilterListByModuleAndType`,
            filter
        );
    }

    saveStateCityZone(fd: FormData): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `api/filter/predefined/predefined-save`,
            fd
        );
    }

    getUnavailability(predefined: PredefinedMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/predefined/by-type-and-code`,
            predefined
        );
    }

    saveUnavailability(fd: FormData): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/predefined/predefined-save`,
            fd
        );
    }

    updatePredefined(uuid: string, fd: FormData): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/predefined/update/` + uuid,
            fd
        );
    }

    deletePredefinedEntityType(uuid: string) {
        return this.http.delete(
            environment.apiUrl + "/predefined/delete/" + uuid
        );
    }

    deleteProductCategory(uuid: string) {
        return this.http.delete(
            environment.apiUrl + "/masters/delete-product-category/" + uuid
        );
    }

    getServiceRequestStatus(service: PredefinedMaster) {
        return this.http.post(
            environment.apiUrl + "/predefined/by-type-and-code",
            service
        );
    }

    saveCityInMaster(fd: FormData): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/predefined/predefined-save",
            fd
        );
    }

    statusForPredefined(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/predefined/change-status/${uuid}`
        );
    }

    statusForProductCategory(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl +
                `/masters/change-product-category-status/${uuid}`
        );
    }

    statusForRepairChecklist(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/masters/change-ps-sop-status/${uuid}`
        );
    }

    statusForProblemDiagnosis(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/masters/change-ps-sop-status/${uuid}`
        );
    }

    getPredefinedByCount(predefined: PredefinedMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `/predefined/predefined-count`,
            predefined
        );
    }
}
