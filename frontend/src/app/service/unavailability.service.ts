import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SessionClient } from "../configuration/sessionclientstorage";
import { Unavailability } from "../model/unavailability.modal";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class UnavailabilityService {
    constructor(
        private http: HttpClient,
        private sessionClient: SessionClient
    ) {}

    getUnavailability(Unavailability: Unavailability): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `api/masters/list-unavailability`,
            Unavailability
        );
    }

    saveUnavailability(fd: FormData): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + `api/filter/predefined/predefined-save`,
            fd
        );
    }
}
