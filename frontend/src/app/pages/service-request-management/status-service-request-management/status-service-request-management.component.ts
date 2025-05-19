import { DatePipe } from "@angular/common";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import {
    AssigneServiceRequest,
    Doc,
    RescheduleServiceRequest,
    ServiceDetailsActivity,
    ServiceEngineerList,
    ServiceRequestList,
    ServiceRequestMaster,
    SlotMaster,
    SopDetail,
    SparePart,
} from "src/app/model/ServiceRequest.model";
import { AuthService } from "src/app/service/auth.service";
import { PredefinedService } from "src/app/service/predefined.service";
import { ServiceRequestService } from "src/app/service/servicerequest.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import { objectValidator } from "../../custom-validator";

@Component({
    selector: "app-status-service-request-management",
    templateUrl: "./status-service-request-management.component.html",
    styleUrls: ["./status-service-request-management.component.scss"],
})
export class StatusServiceRequestManagementComponent implements OnInit {
    tableColsEventProblem: any[] = [];
    tableColsEventSOP: any[] = [];
    tableColsEventSparePart: any[] = [];
    tableColsEventRepairWorkshop: any[] = [];
    tableSettingsEvent: any = {};
    tableSettingsProblemEvent: any = {};
    sparePartTableSettingsEvent: any = {};
    tableSettingsRepairCheckEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEvent: boolean = false;
    showDialogueBoxOnReassign: boolean = false;
    showDialogueBoxOnReschedule: boolean = false;
    showDialogueBoxForSparePart: boolean = false;
    hideButtonView: boolean = false;
    pageSize: number = 10;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    fileSave: any;
    dialogWidth = "650px";
    statusList: PredefinedMaster[] = [];
    slotList: SlotMaster[] = [];
    slotObject: SlotMaster = {} as SlotMaster;
    dummyData: any[] = [];
    dummyDataSOP: any[] = [];
    dummyDataSaprePart: any[] = [];
    dummyDataRepairWorkshop: any[] = [];
    visibleSidebar: boolean = false;
    serviceRequestTypeList: ServiceRequestList[] = [];
    posList: SopDetail[] = [];
    sopList: SopDetail[] = [];
    spareList: SparePart[] = [];
    updateSparePartObj: SparePart = {} as SparePart;
    docList: Doc[] = [];
    serviceRequestListObject: ServiceRequestList = {} as ServiceRequestList;
    personCategory: ServiceRequestList[] = [];
    assigneServiceRequestObject: AssigneServiceRequest =
        {} as AssigneServiceRequest;
    rescheduleServiceRequestObject: RescheduleServiceRequest =
        {} as RescheduleServiceRequest;
    ViewServiceDetailsObject: ServiceDetailsActivity =
        {} as ServiceDetailsActivity;
    technicalReportUrl: string | null = null;
    sopDetails: SopDetail = {} as SopDetail;
    docs: Doc = {} as Doc;
    updateServiceStatusForm: UntypedFormGroup;
    reassignForm: UntypedFormGroup;
    rescheduleForm: UntypedFormGroup;
    customerId: string;
    sparePartUuid: string;
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    selectedPredefinedStatus: PredefinedMaster = {} as PredefinedMaster;
    serviceManualAssignObject: ServiceEngineerList = {} as ServiceEngineerList;
    serviceManualAssignList: ServiceEngineerList[] = [];
    selectedAssigneService: ServiceEngineerList = {} as ServiceEngineerList;

    isViewClicked: boolean = false;

    @Input() serviceRequestObject: ServiceRequestMaster =
        {} as ServiceRequestMaster;

    constructor(
        public authService: AuthService,
        private serviceRequestService: ServiceRequestService,
        private activatedRoute: ActivatedRoute,
        private predefinedService: PredefinedService,
        private sweetAlertService: SweetAlertService,
        private datePipe: DatePipe
    ) {
        this.activatedRoute.paramMap.subscribe((data: any) => {
            this.serviceRequestObject.uuid = data.params.id;
            this.activatedRoute.queryParamMap.subscribe((data: any) => {
                this.isViewClicked = false;
                if (data.params.isViewClicked === "Y") {
                    this.isViewClicked = true;
                }
            });
            this.getServiceRequestList();
        });
    }

    ngOnInit(): void {
        this.setTableSetting();
        this.getViewServiceDetails();
        this.getServiceRequestStatus("SERVICE-REQUEST-STATUS");
        this.getManualAssign();
        this.getSlot();

        this.updateServiceStatusForm = new UntypedFormGroup({
            name: new UntypedFormControl("", [Validators.required]),
        });

        this.reassignForm = new UntypedFormGroup({
            manual_assign: new UntypedFormControl({} as PredefinedMaster, [
                objectValidator(),
            ]),
        });

        this.rescheduleForm = new UntypedFormGroup({
            date: new UntypedFormControl("", [Validators.required]),
            slot: new UntypedFormControl("", [Validators.required]),
        });
    }

    setTableSetting() {
        this.searchPlaceholder = "Product Name";
        this.tableSettingsEvent = {
            tableFilter: false,
            add: false,
            action: true,
            filter: false,
            clear: false,
            export: false,
            paginate: false,
            delete: false,
            edit: true,
            view: false,
            active: false,
            deactive: false,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: false,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: false,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
        };

        this.tableSettingsProblemEvent = {
            tableFilter: false,
            add: false,
            action: false,
            filter: false,
            clear: false,
            export: false,
            paginate: false,
            delete: false,
            edit: false,
            view: false,
            active: false,
            deactive: false,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: false,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: false,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
        };

        this.tableSettingsRepairCheckEvent = {
            tableFilter: false,
            add: false,
            action: false,
            filter: false,
            clear: false,
            export: false,
            paginate: false,
            delete: false,
            edit: false,
            view: false,
            active: false,
            deactive: false,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: false,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: false,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
        };

        this.sparePartTableSettingsEvent = {
            tableFilter: false,
            add: false,
            action: true,
            filter: false,
            clear: false,
            export: false,
            paginate: false,
            delete: false,
            edit: true,
            view: false,
            active: false,
            deactive: false,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: false,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: false,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
        };

        this.tableColsEventProblem = [
            {
                field: "name",
                header: "Problem Statement",
                fieldType: "text",
            },
            {
                field: "checked",
                header: "Status",
                fieldType: "text",
            },
            {
                field: "checked_on",
                header: "Updated by",
                fieldType: "text",
            },
        ];

        this.tableColsEventSOP = [
            {
                field: "name",
                header: "Repair Checklist Statement",
                fieldType: "text",
            },
            {
                field: "checked",
                header: "Status",
                fieldType: "text",
            },
            {
                field: "checked_on",
                header: "Updated by",
                fieldType: "text",
            },
        ];

        this.tableColsEventSparePart = [
            {
                field: "spare_part_name",
                header: "New Spare Part",
                fieldType: "text",
            },
            {
                field: "sku",
                header: "SKU",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Invoice Status",
                fieldType: "text",
            },
            {
                field: "total_payable",
                header: "Price",
                fieldType: "text",
            },
            {
                field: "tax_total",
                header: "Tax",
                fieldType: "text",
            },
            {
                field: "discount_total",
                header: "Discount",
                fieldType: "text",
            },
            {
                field: "subtotal",
                header: "Total Price",
                fieldType: "text",
            },
            {
                field: "is_old_collected",
                header: "Old Spare Part Collected",
                fieldType: "text",
            },
            {
                field: "is_old_received",
                header: "Old Spare Part Received",
                fieldType: "text",
            },
        ];

        this.tableColsEventRepairWorkshop = [
            {
                field: "file_path",
                header: "Repair Workshop",
                fieldType: "image",
            },
            {
                field: "date",
                header: "Send Date",
                fieldType: "text",
            },
            {
                field: "remarks",
                header: "Send Remarks",
                fieldType: "text",
            },
            {
                field: "date",
                header: "Receive Date",
                fieldType: "text",
            },
            {
                field: "remarks",
                header: "Receive Remarks",
                fieldType: "text",
            },
        ];
    }

    closeEventDialog() {
        this.openAddDialogModuleEvent = false;
        this.showDialogueBoxOnReassign = false;
        this.showDialogueBoxOnReschedule = false;
        this.showDialogueBoxForSparePart = false;
    }

    openDialogueBoxForReassign() {
        this.showDialogueBoxOnReassign = true;
    }

    openDialogueBoxForReschedule() {
        this.showDialogueBoxOnReschedule = true;
    }

    openDialogueBoxForSparePart(sparePart: ServiceRequestList) {
        this.sparePartUuid = sparePart.uuid;
        this.showDialogueBoxForSparePart = true;
        // if (this.isViewClicked) {
        //     this.showDialogueBoxForSparePart = false;
        // } else {
        //     this.sparePartUuid = sparePart.uuid;
        //     this.showDialogueBoxForSparePart = true;
        // }
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        // this.product.pageNumber = event.page;
        // this.product.pageSize = this.pageSize;
    }

    addEvent() {
        // this.titleEVent="Add Product";
    }

    EditEvent($event) {
        // this.titleEVent="Update Product";
    }

    searchData($event) {
        // this.product.searchValue= $event;
        // this.getProductList();
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
        // this.getProductList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        // this.product = new ProductMaster();
        // this.getProductList();
        this.visibleSidebar = false;
    }

    // getStatusDetails() {
    //     statusList;
    // }

    getServiceRequestList() {
        this.serviceRequestService
            .getServiceRequestList(this.serviceRequestObject.uuid)
            .subscribe(
                (data: any) => {
                    this.serviceRequestListObject = data;
                    if (
                        this.serviceRequestListObject.spare_parts &&
                        this.serviceRequestListObject.spare_parts.length > 0
                    ) {
                        this.serviceRequestListObject.spare_parts_string = "";
                        for (let spare_part of this.serviceRequestListObject
                            .spare_parts) {
                            this.serviceRequestListObject.spare_parts_string +=
                                spare_part.spare_part_name + ",";
                        }
                        if (
                            this.serviceRequestListObject.spare_parts_string.endsWith(
                                ","
                            )
                        ) {
                            this.serviceRequestListObject.spare_parts_string =
                                this.serviceRequestListObject.spare_parts_string.slice(
                                    0,
                                    -1
                                );
                        }
                        this.spareList =
                            this.serviceRequestListObject.spare_parts;
                    }

                    if (
                        this.serviceRequestListObject.sop_details &&
                        this.serviceRequestListObject.sop_details.length > 0
                    ) {
                        for (let sop_details of this.serviceRequestListObject
                            .sop_details) {
                            sop_details.checked === true ? "Yes" : "No";
                            if (sop_details.is_ps_sop === 1) {
                                this.posList.push(sop_details);
                            } else if (sop_details.is_ps_sop === 2) {
                                this.sopList.push(sop_details);
                            }
                        }
                    }
                    if (
                        this.serviceRequestListObject.doc &&
                        this.serviceRequestListObject.doc.length > 0
                    ) {
                        for (let doc of this.serviceRequestListObject.doc) {
                            if (doc.image_set === 4) {
                                this.docList =
                                    this.serviceRequestListObject.doc;
                            } else if (doc.image_set === 5) {
                                this.docList =
                                    this.serviceRequestListObject.doc;
                            }
                        }
                    }

                    if (
                        this.serviceRequestListObject.doc &&
                        this.serviceRequestListObject.doc.length > 0
                    ) {
                        for (let doc of this.serviceRequestListObject.doc) {
                            if (doc.image_set === 4) {
                                this.tableColsEventRepairWorkshop = [
                                    {
                                        field: "file_path",
                                        header: "Repair Workshop",
                                        fieldType: "text",
                                    },
                                    {
                                        field: "date",
                                        header: "Send Date",
                                        fieldType: "text",
                                    },
                                    {
                                        field: "remarks",
                                        header: "Send Remarks",
                                        fieldType: "text",
                                    },
                                ];
                            }
                            if (doc.image_set === 5) {
                                this.tableColsEventRepairWorkshop = [
                                    {
                                        field: "file_path",
                                        header: "Repair Workshop",
                                        fieldType: "text",
                                    },
                                    {
                                        field: "date",
                                        header: "Receive Date",
                                        fieldType: "text",
                                    },
                                    {
                                        field: "remarks",
                                        header: "Receive Remarks",
                                        fieldType: "text",
                                    },
                                ];
                            }
                        }
                    }
                    this.serviceRequestListObject.service_person_category;

                    this.personCategory = data.service_person_category;

                    this.selectedPredefinedStatus = this.statusList.find(
                        (item) =>
                            item.name === this.serviceRequestListObject.status
                    );

                    console.log(
                        "Service Request Type",
                        this.serviceRequestTypeList
                    );
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getViewServiceDetails() {
        this.serviceRequestService
            .getViewServiceDetails(this.serviceRequestObject.uuid)
            .subscribe(
                (data: any) => {
                    this.ViewServiceDetailsObject = data;
                    console.log(
                        "View Service Details",
                        this.ViewServiceDetailsObject
                    );
                },
                (err) => {
                    console.log(err, "Error");
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

                    default:
                        break;
                }
            });
    }

    getManualAssign() {
        this.serviceRequestService
            .getServiceEngineerList(this.serviceManualAssignObject)
            .subscribe(
                (data: any) => {
                    this.serviceManualAssignList = data;

                    console.log(
                        "Manual Assign Dropdown",
                        this.serviceManualAssignList
                    );
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getSlot() {
        this.serviceRequestService.getSlot(this.slotObject).subscribe(
            (data: any) => {
                this.slotList = data;
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    saveAssigne() {
        this.updateServiceStatusForm.markAllAsTouched();
        if (!this.updateServiceStatusForm.valid) {
            return;
        }

        this.assigneServiceRequestObject.status_uuid =
            this.selectedPredefinedStatus.uuid;

        this.assigneServiceRequestObject.service_person_uuid =
            this.selectedAssigneService.uuid;
        const fd = new FormData();
        fd.append("data", JSON.stringify(this.assigneServiceRequestObject));
        this.serviceRequestService
            .saveAssigne(fd, this.serviceRequestObject.uuid)
            .subscribe(
                (data) => {
                    this.showDialogueBoxOnReassign = false;
                    this.sweetAlertService.successAlert(
                        "Data added successfully!"
                    );
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong");
                }
            );
    }

    saveReschedule() {
        this.rescheduleForm.markAllAsTouched();
        if (!this.rescheduleForm.valid) {
            return;
        }
        this.rescheduleForm;

        this.rescheduleServiceRequestObject.slot_uuid = this.slotObject.uuid;
        this.rescheduleServiceRequestObject.is_reschedule = true;
        this.rescheduleServiceRequestObject.service_date =
            this.datePipe.transform(
                this.rescheduleServiceRequestObject.service_date,
                "yyyy-MM-dd"
            );

        this.serviceRequestService
            .saveReschedule(
                this.serviceRequestObject.uuid,
                this.rescheduleServiceRequestObject
            )
            .subscribe(
                (data) => {
                    this.showDialogueBoxOnReschedule = false;
                    this.sweetAlertService.successAlert(
                        "Data added successfully!"
                    );
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong");
                }
            );
    }

    updateSpareParts() {
        if (this.updateSparePartObj.is_old_status === "Received") {
            this.updateSparePartObj.is_old_received = true;
        }

        this.updateSparePartObj.is_old_status = undefined;
        const fd = new FormData();
        fd.append("data", JSON.stringify(this.updateSparePartObj));
        this.serviceRequestService
            .updateSparePartStatus(fd, this.sparePartUuid)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                    this.getServiceRequestList();
                    this.showDialogueBoxForSparePart = false;
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }
    getTechnicalReportDetails(event: Event) {
        event.preventDefault();
        this.serviceRequestService
            .getTechnicalReportDetails(this.serviceRequestObject.uuid)
            .subscribe(
                (data: Blob) => {
                    const blob = new Blob([data], { type: data.type });
                    const url = window.URL.createObjectURL(blob);
                    this.technicalReportUrl = url;
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "Technical_Report.pdf";
                    a.click();
                    window.URL.revokeObjectURL(url);
                },
                (err) => {
                    console.log("Error", err);
                }
            );
    }
}
