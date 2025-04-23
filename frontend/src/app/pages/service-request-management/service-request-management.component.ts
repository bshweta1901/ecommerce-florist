import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import {
    ServiceRequestMaster,
    ServiceRequestStats,
} from "src/app/model/ServiceRequest.model";
import { AuthService } from "src/app/service/auth.service";
import { PredefinedService } from "src/app/service/predefined.service";
import { ServiceRequestService } from "src/app/service/servicerequest.service";
import { Address } from "src/app/demo/domain/customer";
declare var require: any;
const FileSaver = require("file-saver");

@Component({
    selector: "app-service-request-management",
    templateUrl: "./service-request-management.component.html",
    styleUrls: ["./service-request-management.component.scss"],
})
export class ServiceRequestManagementComponent implements OnInit {
    selectedCategory: any;
    addedPackages: Array<{ selectedCategory: any }> = [];
    tableColsEvent: any[] = [];
    tableSettingsEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEvent: boolean = false;
    hideButtonView: boolean = false;
    pageSize: number = 5;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    cityList: any[] = [];
    address: Address = {} as Address;
    fileSave: any;
    dialogWidth = "650px";
    statusList: any[] = [];
    visibleSidebar: boolean = false;
    serviceRequestList: ServiceRequestMaster[] = [];
    serviceRequestObject: ServiceRequestMaster = {} as ServiceRequestMaster;
    serviceRequestCount: ServiceRequestMaster[] = [];
    serviceRequestStatus: PredefinedMaster[] = [];
    serviceTypeList: PredefinedMaster[] = [];
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    selectedLocation: PredefinedMaster = {} as PredefinedMaster;
    selectedServiceType: PredefinedMaster = {} as PredefinedMaster;
    customerId: string;
    is_table_loaded = false;
    serviceRequestStatsObject: ServiceRequestStats = {} as ServiceRequestStats;
    // exportServiceRequestObject: ExportServiceRequest =
    //     {} as ExportServiceRequest;

    constructor(
        public authService: AuthService,
        private serviceRequestService: ServiceRequestService,
        private predefinedService: PredefinedService,
        private route: Router
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        this.getServiceRequest();
        this.getServiceRequestStatus("SERVICE-REQUEST-STATUS");
        this.getServiceRequestStatus("CITY");
        this.getServiceRequestStatus("PACKAGE-SERVICE-TYPE");
        this.getServiceRequestStats();
        this.getServiceRequestCount();
    }

    setTableSetting() {
        this.searchPlaceholder = "Service Request";
        this.tableSettingsEvent = {
            // tableFilter: false,
            add: false,
            action: true,
            filter: true,
            clear: false,
            export: true,
            paginate: true,
            delete: false,
            edit: false,
            active: true,
            deactive: true,
            activeDeactives: false,
            allowExport: true,
            allowExportxl: false,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: true,
            addServicePerson: false,
            viewForServiceRequest: true,
            updateStatusForOrderDetails: false,
            addSparePart: false,
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
        };

        this.tableColsEvent = [
            { field: "index", header: "Sr.No", fieldType: "index" },
            { field: "ref_id", header: "Ref Id", fieldType: "text" },
            {
                field: "service_date",
                header: "Service Date",
                fieldType: "date",
            },
            {
                field: "account_name",
                header: "Client Name",
                fieldType: "text",
            },
            {
                field: "location",
                header: "Location",
                fieldType: "text",
            },
            {
                field: "service_person",
                header: "Service Person",
                fieldType: "text",
            },
            {
                field: "service_type",
                header: "Service Type",
                fieldType: "text",
            },
            {
                field: "package_name",
                header: "Package",
                fieldType: "text",
            },
            {
                field: "product_name",
                header: "Product name",
                fieldType: "text",
            },
            {
                field: "turn_around_time",
                header: "TAT",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];
    }

    showDropdown() {
        this.addedPackages.push({ selectedCategory: null });
    }

    closeEventDialog() {
        this.openAddDialogModuleEvent = false;
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        this.serviceRequestObject.page = event.page + 1;
        this.serviceRequestObject.per_page = this.pageSize;
        this.getServiceRequest();
    }

    addEvent() {
        // this.titleEVent="Add Product";
        // this.product = new ProductMaster();
        // this.openAddDialogModuleEvent=true;
        // this.hideButtonView=true;
    }

    EditEvent($event) {
        // this.titleEVent="Update Product";
        // this.product = $event;
        // this.productService.setProductSession(this.product);
        // this.getProductById(this.product);
    }

    searchData($event) {
        this.serviceRequestObject.search_by = $event;
        this.getServiceRequest();
    }

    deleteEvent(event) {}

    activeEntity($event) {}
    openSidebar() {
        this.visibleSidebar = true;
        // this.getProductList();
    }

    deactiveEntity($event) {}

    saveEventDialog() {
        this.openAddDialogModuleEvent = false;
        // this.product = new ProductMaster();
        // this.getProductList();
    }

    searchFilter() {
        this.serviceRequestObject.status_uuid =
            this.predefinedMasterObject.uuid;
        this.serviceRequestObject.location_uuid = this.selectedLocation?.uuid;
        this.serviceRequestObject.service_type_uuid =
            this.selectedServiceType?.uuid;
        this.getServiceRequest();

        this.visibleSidebar = false;
    }
    resetFilter() {
        this.serviceRequestObject = {} as ServiceRequestMaster;
        this.predefinedMasterObject = new PredefinedMaster();
        this.selectedLocation = {} as PredefinedMaster;
        this.getServiceRequest();
        this.visibleSidebar = false;
    }

    onViewClicked(serviceRequest: ServiceRequestMaster) {
        this.route.navigate(
            ["/panel/status-service-request-management/" + serviceRequest.uuid],
            { queryParams: { isViewClicked: "Y" } }
        );
    }

    getServiceRequest() {
        let stringTemp = localStorage.getItem("today_unassigned_stats");
        let stringMachineTemp = localStorage.getItem("machine_in_repair_stats");
        let oldSpareTemp = localStorage.getItem("oldSpare");
        let overdueStatsTemp = localStorage.getItem("overdue_sr_stats");

        if (stringTemp != null && stringTemp != undefined) {
            this.serviceRequestObject.today_unassigned_stats = true;
        }
        if (stringMachineTemp != null && stringMachineTemp != undefined) {
            this.serviceRequestObject.machine_in_repair_stats = true;
        }
        if (oldSpareTemp != null && oldSpareTemp != undefined) {
            this.serviceRequestObject.old_spare_parts_not_collected_stats =
                true;
        }
        if (overdueStatsTemp != null && overdueStatsTemp != undefined) {
            this.serviceRequestObject.overdue_sr_stats = true;
        }

        this.serviceRequestService
            .getServiceRequest(this.serviceRequestObject)
            .subscribe(
                (data: any) => {
                    this.serviceRequestList = data;
                    this.is_table_loaded = true;

                    for (const request of this.serviceRequestList) {
                        const status = request["status"];
                        if (
                            status === "Accepted" ||
                            status === "Pending" ||
                            status === "Unassigned"
                        ) {
                            // Show only view if any request is completed
                            request.viewForServiceRequest = true;
                            request.reassignForServiceRequest = true;
                            request.rescheduleForServiceRequest = true;
                        } else if (status === "Reject") {
                            // Show all: view, reassign, reschedule
                            request.viewForServiceRequest = true;
                            request.reassignForServiceRequest = true;
                            request.rescheduleForServiceRequest = true;
                        } else if (
                            status === "In Progress" ||
                            status === "Completed"
                        ) {
                            // Show view and reschedule only
                            request.viewForServiceRequest = true;
                            request.reassignForServiceRequest = false;
                            request.rescheduleForServiceRequest = false;
                        }
                    }

                    console.log(
                        "service Request List",
                        this.serviceRequestList
                    );
                },
                (err) => {
                    console.log(err, "Error");
                    this.is_table_loaded = true;
                }
            );
    }

    filterServiceRequestByDate() {
        this.serviceRequestObject.today_stats = true;
        this.serviceRequestObject.sla_missed_stats = undefined;
        this.serviceRequestService
            .getServiceRequest(this.serviceRequestObject)
            .subscribe(
                (data: any) => {
                    this.serviceRequestList = data;
                    this.is_table_loaded = true;
                },
                (err) => {
                    console.log(err, "Error");
                    this.is_table_loaded = true;
                }
            );
    }

    filterServiceRequestByMissed() {
        this.serviceRequestObject.today_stats = undefined;
        this.serviceRequestObject.sla_missed_stats = true;
        this.serviceRequestService
            .getServiceRequest(this.serviceRequestObject)
            .subscribe(
                (data: any) => {
                    this.serviceRequestList = data;
                    this.is_table_loaded = true;
                },
                (err) => {
                    console.log(err, "Error");
                    this.is_table_loaded = true;
                }
            );
    }

    getServiceRequestStatus(type: string) {
        this.predefinedMasterObject.entity_type = type;
        this.predefinedService
            .getServiceRequestStatus(this.predefinedMasterObject)
            .subscribe((data: any) => {
                switch (type) {
                    case "SERVICE-REQUEST-STATUS":
                        this.statusList = data.data;
                        if (this.customerId) {
                            this.predefinedMasterObject =
                                this.statusList.filter(
                                    (status: PredefinedMaster) =>
                                        status.name ===
                                        this.predefinedMasterObject.name
                                )[0];
                        }
                        break;
                    case "CITY":
                        this.cityList = data.data;
                        if (this.customerId) {
                            this.predefinedMasterObject = this.cityList.filter(
                                (city: PredefinedMaster) =>
                                    city.name === this.address.city
                            )[0];
                        }
                        break;
                    case "PACKAGE-SERVICE-TYPE":
                        this.serviceTypeList = data.data;
                        // if (this.customerId) {
                        //     this.selectedServiceType = this.serviceTypeList.filter(
                        //         (type: PredefinedMaster) =>
                        //             type.name === this.selectedServiceType.name
                        //     )[0];
                        // }
                        break;

                    default:
                        break;
                }
            });
    }

    getServiceRequestStats() {
        this.serviceRequestService.getServiceRequestStats().subscribe(
            (data: any) => {
                this.serviceRequestStatsObject = data;

                console.log(
                    "service Stats List",
                    this.serviceRequestStatsObject
                );
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    exportServiceRequestList() {
        let customer = JSON.parse(JSON.stringify(this.serviceRequestObject));
        this.serviceRequestService.exportServiceRequestList(customer).subscribe(
            (data: any) => {
                const blob = new Blob([data], {
                    type: "application/octet-stream",
                });
                FileSaver.saveAs(blob, "serviceRequest.xlsx");
            },
            (err) => {
                const blob1 = new Blob([err.error.text], {
                    type: "application/octet-stream",
                });
                FileSaver.saveAs(blob1, "serviceRequest.xlsx");
            }
        );
    }

    getServiceRequestCount() {
        let stringTemp = localStorage.getItem("today_unassigned_stats");
        let stringMachineTemp = localStorage.getItem("machine_in_repair_stats");
        let oldSpareTemp = localStorage.getItem("oldSpare");
        let overdueStatsTemp = localStorage.getItem("overdue_sr_stats");

        if (stringTemp != null && stringTemp != undefined) {
            this.serviceRequestObject.today_unassigned_stats = true;
        }
        if (stringMachineTemp != null && stringMachineTemp != undefined) {
            this.serviceRequestObject.machine_in_repair_stats = true;
        }
        if (oldSpareTemp != null && oldSpareTemp != undefined) {
            this.serviceRequestObject.old_spare_parts_not_collected_stats =
                true;
        }
        if (overdueStatsTemp != null && overdueStatsTemp != undefined) {
            this.serviceRequestObject.overdue_sr_stats = true;
        }
        this.serviceRequestService
            .getServiceRequestCount(this.serviceRequestObject)
            .subscribe(
                (data: any) => {
                    this.totalRecords = data.count;

                    console.log(
                        "service Stats Count",
                        this.serviceRequestObject
                    );
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }
}
