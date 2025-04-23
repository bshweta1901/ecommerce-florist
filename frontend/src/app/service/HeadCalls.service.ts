import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class HeadCallsService {
  getHeadCallsResponse: any;

  constructor(public http: HttpClient) {}

  getHeadCalls() {
    const getJsonDataValue = localStorage.getItem("headCallsResponse");
    this.getHeadCallsResponse = JSON.parse(getJsonDataValue);
    return this.getHeadCallsResponse;
  }
}
