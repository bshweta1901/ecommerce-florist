import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SessionClient } from "../configuration/sessionclientstorage";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {
    LegalBranch,
    LegalEntity,
    LegalSubsidiary,
} from "../model/LegalEntity.model";

@Injectable({
    providedIn: "root",
})
export class LegalEntityService {
    constructor(private http: HttpClient) {}

    getLegalEntityList(legal: LegalEntity): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/legal-entity/list",
            legal
        );
    }

    getLegalBranchList(legal: LegalBranch): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/legal-entity/branch/list",
            legal
        );
    }

    getLegalSubsidiaryList(legal: LegalSubsidiary): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/legal-entity/subsidiary/list",
            legal
        );
    }

    saveLegalEntity(fd: FormData): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/legal-entity/create",
            fd
        );
    }

    saveLegalBranch(fd: FormData): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/legal-entity/create-branch",
            fd
        );
    }

    saveLegalSubsidiary(subsidiary: LegalSubsidiary): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/legal-entity/create-subsidiary",
            subsidiary
        );
    }

    updateLegalEntity(uuid: string, fd: FormData): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/legal-entity/` + uuid,
            fd
        );
    }

    updateLegalBranch(uuid: string, fd: FormData): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/legal-entity/branch/` + uuid,
            fd
        );
    }

    updateLegalSubsidiary(
        uuid: string,
        subsidiary: LegalSubsidiary
    ): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/legal-entity/subsidiary/` + uuid,
            subsidiary
        );
    }

    activeDeactiveLegalEntity(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/legal-entity/change-status/${uuid}`
        );
    }

    activeDeactiveLegalBranch(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/legal-entity/branch/change-status/${uuid}`
        );
    }

    activeDeactiveLegalSubsidiary(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl +
                `/legal-entity/subsidiary/change-status/${uuid}`
        );
    }

    getLegalEntityCount(legal: LegalEntity): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/legal-entity/count",
            legal
        );
    }

    getLegalBranchCount(legal: LegalBranch): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/legal-entity/branch/count",
            legal
        );
    }

    getLegalSubsidiaryCount(legal: LegalSubsidiary): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/legal-entity/subsidiary/count",
            legal
        );
    }

    // deleteLegalEntity(uuid: string) {
    //     return this.http.delete(
    //         environment.apiUrl + "/predefined/delete/" + uuid
    //     );
    // }
}
