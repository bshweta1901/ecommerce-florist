import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { DashboardService } from "src/app/service/dashboard.service";
import * as moment from "moment";
import { ChillerMaster } from "src/app/model/ChillerMaster.model";
import { Factory } from "src/app/model/Factory.model";
import { Freezer } from "src/app/model/Freezer.model";
import {
    ContractStatusMaster,
    InstallationMaster,
    InvoiceMaster,
    MachineStatusMaster,
    ServiceRequestSlaMaster,
} from "src/app/model/Dashboard.model";
import { ServiceRequestMaster } from "src/app/model/ServiceRequest.model";
import { Router } from "@angular/router";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { PredefinedService } from "src/app/service/predefined.service";

@Component({
    templateUrl: "./dashboard.component.html",
    styleUrls: ["../../../assets/demo/badges.scss"],
})
export class DashboardDemoComponent implements OnInit {
    dashboardData: any = {};
    lineData: any;
    lineOptions: any;
    butcher: ChillerMaster = new ChillerMaster();
    openModalDashaboard: boolean = false;
    // lineDataPacker:any;
    // packerOptions: any;
    chiller_utilization: any;
    sequences: any[] = [];
    chiller: ChillerMaster = new ChillerMaster();
    freezer: Freezer = new Freezer();
    intervalId: any;
    factory: Factory = new Factory();
    tableRows: any = {} as any;
    tableHeaders: any[] = [];
    selectedDates: Date[];
    selectedOvweViewDates: Date[];
    monthlyData: any = {};
    showDivs: boolean = false;
    dashboardInstallationObject: InstallationMaster = {} as InstallationMaster;
    dashboardMachineStatusObject: MachineStatusMaster =
        {} as MachineStatusMaster;
    dashboardContractStatusObject: ContractStatusMaster =
        {} as ContractStatusMaster;
    dashboardServiceSLAObject: ServiceRequestSlaMaster =
        {} as ServiceRequestSlaMaster;
    dashboardInvoicingObject: InvoiceMaster = {} as InvoiceMaster;
    serviceRequest: ServiceRequestMaster = new ServiceRequestMaster();
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    productivityTrackingtemp: any;
    financialList: PredefinedMaster[] = [];

    constructor(
        private dashboardService: DashboardService,
        public router: Router,
        private predefinedService: PredefinedService
    ) {}
    selectedDate: Date;

    maxDate: Date;
    CurrentMonthDate: Date;
    todayDate: Date;
    rangeDates: Date[] | undefined;
    ngOnInit() {
        this.todayDate = new Date();
        this.maxDate = new Date();
        this.selectedDate = new Date();

        this.getDashboardInstallation();
        this.getDashboardMachineStatus();
        this.getDashboardContractStatus();
        this.getDashboardServiceSLA();
        this.getDashboardInvoicing();
        this.productivityTracking();
        this.getFinancialYear("FINANCIAL-YEAR");
    }

    getYesterday(): Date {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return yesterday;
    }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    getDashboardInstallation() {
        this.dashboardService.getDashboardInstallation().subscribe(
            (data: any) => {
                this.dashboardInstallationObject = data;

                console.log(
                    "Installation List",
                    this.dashboardInstallationObject
                );
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    getDashboardMachineStatus() {
        this.dashboardService.getDashboardMachineStatus().subscribe(
            (data: any) => {
                this.dashboardMachineStatusObject = data;

                console.log(
                    "Machine Status List",
                    this.dashboardMachineStatusObject
                );
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    getDashboardContractStatus() {
        this.dashboardService.getDashboardContractStatus().subscribe(
            (data: any) => {
                this.dashboardContractStatusObject = data;

                console.log(
                    "Contract Status List",
                    this.dashboardContractStatusObject
                );
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }
    onSelect() {
        this.getDashboardServiceSLA();
    }
    getDashboardServiceSLA() {
        if (this.rangeDates != null && this.rangeDates != undefined) {
            this.serviceRequest.start_date = new Date(
                this.rangeDates[0].getTime() + +(5.5 * 60 * 60 * 1000)
            );
            this.serviceRequest.end_date = new Date(
                this.rangeDates[1].getTime() + +(5.5 * 60 * 60 * 1000)
            );
        } else {
            // this.serviceRequest.start_date = new Date();
            // this.serviceRequest.end_date = new Date();
        }
        this.dashboardService
            .getDashboardServiceSLA(this.serviceRequest)
            .subscribe(
                (data: any) => {
                    this.dashboardServiceSLAObject = data;
                    console.log(
                        this.dashboardServiceSLAObject,
                        "dashboardServiceSLAObject"
                    );
                    // console.log("Service SLA List", this.dashboardServiceSLAObject);
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getDashboardInvoicing() {
        this.dashboardService.getDashboardInvoicing().subscribe(
            (data: any) => {
                this.dashboardInvoicingObject = data;

                console.log("Invoicing List", this.dashboardInvoicingObject);
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }
    productivityTracking() {
        this.dashboardService.getProductivitytracking().subscribe(
            (data: any) => {
                this.productivityTrackingtemp = data;

                console.log("Invoicing List", this.dashboardInvoicingObject);
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    todayUnassignTask(text: any) {
        localStorage.setItem(text, "todayUnassignTask");
        this.router.navigateByUrl("/panel/service-request-management");
    }
    machineRepair(text: any) {
        localStorage.setItem(text, "machineRepair");
        this.router.navigateByUrl("/panel/service-request-management");
    }
    oldSpare(text: any) {
        localStorage.setItem(text, "oldSpare");
        this.router.navigateByUrl("/panel/service-request-management");
    }
    machineOpenSr(text: any) {
        localStorage.setItem(text, "overdue_sr_stats");
        this.router.navigateByUrl("/panel/service-request-management");
    }
    pendingSpareOrder(text: any) {
        localStorage.setItem(text, "pending_spare_part_stats");
        this.router.navigateByUrl("/panel/order-details");
    }
    enginerrUnavailable(text: any) {
        localStorage.setItem(text, "unavailable_engineer_stats");
        this.router.navigateByUrl("/panel/service-person-management");
    }

    RedirectToServiceRequest() {
        this.router.navigate(["/panel/service-request-management"]);
    }

    getFinancialYear(type: string) {
        this.predefinedMasterObject.entity_type = type;
        this.predefinedService
            .getServiceRequestStatus(this.predefinedMasterObject)
            .subscribe((data: any) => {
                switch (type) {
                    case "FINANCIAL-YEAR":
                        this.financialList = data.data;
                        break;

                    default:
                        break;
                }
            });
    }
}
