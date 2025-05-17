import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "src/app/service/auth.service";
import { CalendarOptions } from "@fullcalendar/core";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { ServiceRequestService } from "src/app/service/servicerequest.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import {
    Addresses,
    RoleServiceEngineer,
    ServiceEngineerList,
    ServiceEngineerMaster,
    ServicePerson,
    ServiceRequestMaster,
    SlotMaster,
    UpdateEngineerRequest,
} from "src/app/model/ServiceRequest.model";
import { ProductService } from "src/app/service/product.service";
import { ProductCategory } from "src/app/model/Product";
import { PredefinedService } from "src/app/service/predefined.service";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { Address } from "src/app/demo/domain/customer";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { User } from "src/app/model/User.model";
@Component({
    selector: "app-add-service-person-management",
    templateUrl: "./add-service-person-management.component.html",
    styleUrls: ["./add-service-person-management.component.scss"],
})
export class AddServicePersonManagementComponent implements OnInit {
    @ViewChild("calendar") calendarComponent: FullCalendarComponent;
    tableColsEvent: any[] = [];
    tableRequestColsEvent: any[] = [];
    tableRequestSettingsEvent: any = {};
    tableSettingsEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEvent: boolean = false;
    hideButtonView: boolean = false;
    openDialogModuleForUpdateStatus: boolean = false;
    isStateSelected: boolean = false;
    openDialogModuleForUnavailability: boolean = false;
    openDialogModuleForAccepted: boolean = false;
    pageSize: number = 10;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    selectedDate: Date | null = null;
    isCalendarVisible: boolean = false;
    fileSave: any;
    dialogWidth = "650px";
    dialogWidthForCalendar = "350px";
    statusList: any[] = [];
    matchedId: any[] = [];
    visibleSidebar: boolean = false;
    serviceEngineerDetailObject: ServiceEngineerMaster =
        {} as ServiceEngineerMaster;
    product_category_uuids: [];
    serviceEngineerDetailList: ServiceEngineerMaster[] = [];
    productCategoryDropdownList: ProductCategory[] = [];
    selectedProductCategory: ProductCategory = {} as ProductCategory;
    selectedProductCategoryList: ProductCategory[] = [];
    cityTypeList: PredefinedMaster[] = [];
    stateList: PredefinedMaster[] = [];
    cityList: PredefinedMaster[] = [];
    getCityData: any[] = [];
    selectedCity: PredefinedMaster = {} as PredefinedMaster;
    predefineObject: PredefinedMaster = {} as PredefinedMaster;
    customerId: string;
    actionForEdit: boolean = false;
    actionForView: boolean = false;
    zoneList: PredefinedMaster[] = [];
    address: Address = {} as Address;
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    selectedStatus: PredefinedMaster = {} as PredefinedMaster;
    selectedState: PredefinedMaster = {} as PredefinedMaster;
    selectedCityType: PredefinedMaster = {} as PredefinedMaster;
    selectedZone: PredefinedMaster = {} as PredefinedMaster;
    serviceManagerNameObject: ServiceEngineerList = {} as ServiceEngineerList;
    selectedServiceManager: ServiceEngineerList = {} as ServiceEngineerList;
    servicePersonObject: ServicePerson = {} as ServicePerson;
    serviceManagerNameList: ServiceEngineerList[] = [];
    roleList: RoleServiceEngineer[] = [];
    selectedRoleObject: RoleServiceEngineer = {} as RoleServiceEngineer;
    selectedRole: RoleServiceEngineer = {} as RoleServiceEngineer;
    addPersonalDetailForm: UntypedFormGroup;
    addAddressDetailForm: UntypedFormGroup;
    serviceRequestList: ServiceRequestMaster[] = [];
    serviceRequestObject: ServiceRequestMaster = {} as ServiceRequestMaster;
    serviceEngineerRequestList: ServiceRequestMaster[] = [];
    getCalendarDataObj: any;
    isLoading: boolean = false;
    getReasonsForUnavailability: string;
    getSlotForUnavailability: string;
    getSlotStartTimeForUnavailability: string;
    getSlotEndTimeForUnavailability: string;
    getReasonsForAccepted: string;
    getSlotForAccepted: string;
    getSlotStartTimeForAccepted: string;
    getSlotEndTimeForAccepted: string;
    serviceRequestTableList: ServiceRequestMaster[] = [];
    UpdateEngineerRequestObj: UpdateEngineerRequest =
        {} as UpdateEngineerRequest;
    slotMasterObject: SlotMaster = {} as SlotMaster;
    slotMasterList: SlotMaster[] = [];
    selectedSlotMaster: SlotMaster[] = [];
    filteredserviceManagerList: any[] = [];
    calendarList: any[] = [];
    managerList: User[] = [];
    selectedManager: User = new User();
    manager: User = new User();
    predefined: PredefinedMaster = { page_size: 10000 } as PredefinedMaster;
    calendarOptions: any;

    constructor(
        public authService: AuthService,
        private serviceRequestService: ServiceRequestService,
        private sweetAlertService: SweetAlertService,
        private productService: ProductService,
        private predefinedService: PredefinedService,
        public activatedRoute: ActivatedRoute,
        public router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.customerId = this.route.snapshot.paramMap.get("id");
        this.calendarOptions = {
            eventClick: (arg) => this.onEventClick(arg),
        };

        this.serviceEngineerDetailObject.addresses = {} as Addresses;
        // this.selectedRoleObject = {} as Roles;
        this.setTableSetting();
        this.setRequestTableSetting();
        this.getProductCategoryList();
        this.getPredefinedByType("ZONE");
        this.getPredefinedByType("CITY-TYPE");
        this.getPredefinedByType("CITY");
        this.getPredefinedByType("STATE");
        this.getServiceEngineerStatus("SERVICE-REQUEST-STATUS");
        this.getManagerName();
        this.getRole();
        this.getSlotId();
        // this.getCalendarDate();

        this.route.queryParams.subscribe(() => {
            if (!this.customerId) {
                return;
            }

            this.route.queryParams.subscribe((queryParams) => {
                const action = queryParams["action"];
                if (action === "edit") {
                    this.actionForEdit = true;
                } else if (action === "view") {
                    this.actionForView = true;
                }
                this.getServicePersonById();
            });
            this.getServiceEngineerRequest();
            this.getServiceEngineerDetails();
            this.getServiceEngineerCalender();
        });

        // this.activatedRoute.paramMap.subscribe((url: any) => {
        //     this.customerId = url.params.id;
        //     if (!this.customerId) {
        //         return;
        //     }
        //     this.getServicePersonById();
        // });

        this.addPersonalDetailForm = new UntypedFormGroup({
            uuid: new UntypedFormControl(""),
            first_name: new UntypedFormControl("", Validators.required),
            employeeId: new UntypedFormControl("", Validators.required),
            email: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                ),
            ]),
            phone: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^[6789]\d{9}$/),
            ]),
            selectedProductCategoryList: new UntypedFormControl("", [
                Validators.required,
            ]),
            allowed_discount: new UntypedFormControl("", Validators.required),
            slot: new UntypedFormControl("", [Validators.required]),
            roles: new UntypedFormControl("", [Validators.required]),
            manager_uuid: new UntypedFormControl(""),
            ctc: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
        });

        this.addAddressDetailForm = new UntypedFormGroup({
            uuid: new UntypedFormControl(""),
            address_1: new UntypedFormControl("", Validators.required),
            address_2: new UntypedFormControl(""),
            state: new UntypedFormControl("", [Validators.required]),
            city_type: new UntypedFormControl("", [Validators.required]),
            city: new UntypedFormControl("", [Validators.required]),
            zone_uuid: new UntypedFormControl("", [Validators.required]),
            pincode: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^[0-9]*$/),
            ]),
        });
    }
    setTableSetting() {
        this.searchPlaceholder = "Product Name";
        this.tableSettingsEvent = {
            // tableFilter: false,
            add: false,
            action: true,
            filter: false,
            clear: false,
            export: false,
            paginate: true,
            delete: true,
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
            addSparePart: false,
            addServicePerson: false,
            search: false,
            addOrderDetailsSparePart: false,
            reassignForServiceRequest: false,
            viewForServiceRequest: true,
            rescheduleForServiceRequest: false,
            addOrderDetailsOnDemand: false,
        };
        this.tableColsEvent = [
            {
                field: "service_date",
                header: "Service Date",
                fieldType: "text",
            },
            {
                field: "location",
                header: "Location",
                fieldType: "text",
            },
            {
                field: "due_date",
                header: "Due Date",
                fieldType: "text",
            },
            {
                field: "product_name",
                header: "Product Name",
                fieldType: "text",
            },
            {
                field: "serial_no",
                header: " Serial Number",
                fieldType: "text",
            },
            {
                field: "service_type",
                header: "Product/Service Type",
                fieldType: "text",
            },
            {
                field: "tenure",
                header: "Tenure",
                fieldType: "text",
            },
            {
                field: "service_cycle",
                header: "Service Cycle",
                fieldType: "text",
            },
            {
                field: "account_name",
                header: "Account Name",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];
    }

    setRequestTableSetting() {
        this.tableRequestSettingsEvent = {
            add: false,
            action: true,
            filter: false,
            clear: false,
            export: false,
            paginate: true,
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
            addSparePart: false,
            addServicePerson: false,
            search: false,
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
            updateStatusForOrderDetails: true,
        };
        this.tableRequestColsEvent = [
            {
                field: "date",
                header: "Date",
                fieldType: "text",
            },
            {
                field: "service_request",
                subfield: "account_name",
                header: "Service Request ID",
                fieldType: "nestedData",
            },
            {
                field: "user",
                subfield: "first_name",
                header: "Service Person",
                fieldType: "nestedData",
            },
            {
                field: "title",
                subfield: "name",
                header: "Reason",
                fieldType: "nestedData",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
            {
                field: "slotTime",
                header: "Slot Time",
                fieldType: "text",
            },
        ];
    }

    onViewClicked(serviceRequest: ServiceRequestMaster) {
        this.router.navigate(
            ["/panel/status-service-request-management/" + serviceRequest.uuid],
            { queryParams: { isViewClicked: "Y" } }
        );
    }

    onTabChange(event: any): void {
        if (event.index === 2) {
            this.isCalendarVisible = true;
            setTimeout(() => {
                this.calendarComponent.getApi().updateSize();
            }, 0);
        }
    }

    viewDialogueForUpdateStatus(updateStatus: any) {
        this.UpdateEngineerRequestObj.user_uuid = updateStatus?.uuid;
        this.openDialogModuleForUpdateStatus = true;
    }

    closeEventDialog() {
        this.openDialogModuleForUpdateStatus = false;
    }

    closeUnavailabilityEventDialog() {
        this.openDialogModuleForUnavailability = false;
    }

    closeAcceptedEventDialog() {
        this.openDialogModuleForAccepted = false;
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        this.serviceRequestObject.page = event.page + 1;
        this.serviceRequestObject.per_page = this.pageSize;
        this.getServiceEngineerDetails();
    }

    addEvent() {
        // this.titleEVent="Add Product";
        // this.product = new ProductMaster();
    }

    EditEvent($event) {
        // this.titleEVent="Update Product";
    }

    searchData($event) {
        // this.product.searchValue= $event;
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

    resetServiceEngineer() {
        this.serviceEngineerDetailObject = {} as ServiceEngineerMaster;
        this.serviceEngineerDetailObject.addresses = {} as Addresses;
        this.selectedState = {} as PredefinedMaster;
        this.selectedCityType = {} as PredefinedMaster;
        this.selectedZone = {} as PredefinedMaster;
        this.selectedCity = {} as PredefinedMaster;
        this.selectedRole = {} as RoleServiceEngineer;
        this.selectedSlotMaster = [];
        this.selectedProductCategoryList = [];
        this.selectedManager = {} as User;
    }

    getProductCategoryList() {
        this.productService.getProductCategoryList().subscribe(
            (data: any) => {
                this.productCategoryDropdownList = data;
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    saveServiceEngineer() {
        this.addPersonalDetailForm.markAllAsTouched();
        this.addAddressDetailForm.markAllAsTouched();
        if (
            !this.addPersonalDetailForm.valid ||
            !this.addAddressDetailForm.valid
        ) {
            return;
        }
        this.addPersonalDetailForm;
        this.addAddressDetailForm;

        // this.serviceEngineerDetailObject.is_active = this.selectedStatus.uuid;

        this.serviceEngineerDetailObject.slot_uuids = [];
        this.selectedSlotMaster.forEach((cat: SlotMaster) => {
            this.serviceEngineerDetailObject.slot_uuids.push(cat.uuid);
        });

        // this.serviceEngineerDetailObject.slot_uuid =
        //     this.selectedSlotMaster.uuid;
        this.serviceEngineerDetailObject.addresses.city =
            this.selectedCity?.name;
        this.serviceEngineerDetailObject.addresses.city_type =
            this.selectedCityType?.name;
        this.serviceEngineerDetailObject.addresses.state =
            this.selectedState?.name;
        this.serviceEngineerDetailObject.addresses.zone_uuid =
            this.selectedZone?.uuid;
        this.serviceEngineerDetailObject.manager_uuid =
            this.selectedManager?.uuid;
        this.serviceEngineerDetailObject.roles = [];
        this.serviceEngineerDetailObject.roles.push(this.selectedRole?.name);
        this.serviceEngineerDetailObject.product_category_uuids = [];
        this.selectedProductCategoryList.forEach((cat: ProductCategory) => {
            this.serviceEngineerDetailObject.product_category_uuids.push(
                cat?.uuid
            );
        });
        this.serviceEngineerDetailObject.last_name = undefined;
        this.serviceEngineerDetailObject.gender = undefined;
        this.serviceEngineerDetailObject.dob = undefined;
        this.serviceEngineerDetailObject.cost_allocated = undefined;
        this.serviceEngineerDetailObject.modules = undefined;
        this.serviceEngineerDetailObject.product_category_name = undefined;
        this.serviceEngineerDetailObject.modules = undefined;
        this.serviceEngineerDetailObject.role = undefined;
        this.isLoading = true;
        const fd = new FormData();
        fd.append("data", JSON.stringify(this.serviceEngineerDetailObject));
        this.serviceRequestService.saveServiceEngineer(fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                this.router.navigate(["/panel/service-person-management"]);
                this.isLoading = false;
            },
            (err) => {
                // this.sweetAlertService.errorAlert("Something Went Wrong");
                this.sweetAlertService.errorAlert(err.error.error);
            }
        );
    }

    getServiceEngineerDetails() {
        this.serviceRequestObject.service_person_uuid = this.customerId;
        this.serviceRequestService
            .getServiceRequest(this.serviceRequestObject)
            .subscribe(
                (data: any) => {
                    this.serviceRequestList = data;

                    for (const request of this.serviceRequestList) {
                        const status = request["status"];
                        if (status === "Accepted" || status === "Pending") {
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
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getPredefinedByType(type: string) {
        // let predefined = new PredefinedMaster();
        this.predefined.entity_type = type;
        if (type === "STATE") {
            this.predefined.alphabetical_order = true;
        }
        if (type === "CITY") {
            this.predefined.alphabetical_order = true;
        }
        this.predefinedService
            .getPredefinedByTypeAndCode(this.predefined)
            .subscribe((data: any) => {
                switch (type) {
                    case "ZONE":
                        this.zoneList = data.data;
                        if (this.customerId) {
                            this.predefineObject = this.zoneList.filter(
                                (zone: PredefinedMaster) =>
                                    zone.name === this.address.zone
                            )[0];
                        }
                        break;
                    case "CITY-TYPE":
                        this.cityTypeList = data.data;
                        if (this.customerId) {
                            this.predefineObject = this.cityTypeList.filter(
                                (cityType: PredefinedMaster) =>
                                    cityType.name === this.address.city_type
                            )[0];
                        }
                        break;
                    case "STATE":
                        this.stateList = data.data;
                        if (this.customerId) {
                            this.predefineObject = this.stateList.filter(
                                (state: PredefinedMaster) =>
                                    state.name === this.address.state
                            )[0];
                        }
                        break;
                    case "CITY":
                        this.cityList = data.data;

                        if (this.customerId) {
                            this.getCityData.push(this.cityList);
                            this.getServicePersonById();

                            // this.predefineObject = this.cityList.filter(
                            //     (city: PredefinedMaster) =>
                            //         city.name === this.address.city
                            // )[0];
                        }
                        break;

                    default:
                        break;
                }
            });
    }

    onChangeOfState(event) {
        this.isStateSelected = !!this.selectedState;
        this.predefined.parent_uuid = this.selectedState?.uuid;
        this.getPredefinedByType(event);
    }

    getServiceEngineerStatus(type: string) {
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

    getManagerName() {
        this.serviceRequestService
            .getServiceEngineerList(this.serviceManagerNameObject)
            .subscribe(
                (data: any) => {
                    this.serviceManagerNameList = data;

                    console.log(
                        "Manual Assign Dropdown",
                        this.serviceManagerNameList
                    );
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getManagers() {
        this.productService.getManagers(this.manager).subscribe(
            (data: any) => {
                this.managerList = data;
                if (this.customerId) {
                    this.selectedManager = this.managerList.find(
                        (item) =>
                            item.first_name ===
                            this.serviceEngineerDetailObject.manager_name
                    );
                }
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    getSlotId() {
        this.serviceRequestService.getSlotId(this.slotMasterObject).subscribe(
            (data: any) => {
                this.slotMasterList = data.map((slot: any) => ({
                    ...slot,
                    label: `${this.formatTime(
                        slot.start_time
                    )} - ${this.formatTime(slot.end_time)}`,
                }));
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    getRole() {
        this.serviceRequestService.getRole().subscribe(
            (data: any) => {
                // this.roleList = data;
                this.roleList = data.filter((role) => role.code !== "CUSTOMER");

                console.log("Role Dropdown", this.roleList);
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    getServicePersonById() {
        this.productService.getServicePersonById(this.customerId).subscribe(
            (data: any) => {
                this.serviceEngineerDetailObject = data;
                console.log("service person", data);

                this.selectedProductCategoryList = [];
                for (let category of this.productCategoryDropdownList) {
                    for (let categoryName of data.product_category_name) {
                        if (category.product_category === categoryName) {
                            this.selectedProductCategoryList.push(category);
                        }
                    }
                }
                this.selectedSlotMaster = [];
                const slotsArray = data.slots;
                for (let slot of this.slotMasterList) {
                    for (let slotItem of slotsArray) {
                        const formattedLabel = `${this.formatTime(
                            slot.start_time
                        )} - ${this.formatTime(slot.end_time)}`;
                        const categoryLabel = `${this.formatTime(
                            slotItem.start_time
                        )} - ${this.formatTime(slotItem.end_time)}`;

                        if (formattedLabel === categoryLabel) {
                            this.selectedSlotMaster.push({
                                ...slot,
                                label: formattedLabel,
                            });
                        }
                    }
                }

                this.selectedRole = this.roleList.find(
                    (item) => item.name === data.role
                );

                this.selectedCityType = this.cityTypeList.find(
                    (item) => item.name === data.addresses.city_type
                );

                this.selectedZone = this.zoneList.find(
                    (item) => item.name === data.addresses.zone_name
                );

                this.selectedState = this.stateList.find(
                    (item) => item.name === data.addresses.state
                );

                if (this.selectedState) {
                    this.isStateSelected = true;
                    this.getCityData;
                }
                this.cityList = this.getCityData.reduce(
                    (acc, val) => acc.concat(val),
                    []
                );

                this.selectedCity = this.cityList.find(
                    (item) => item.name === data.addresses.city
                );

                this.getManagers();
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    updateServiceEngineer() {
        this.addPersonalDetailForm.markAllAsTouched();
        this.addAddressDetailForm.markAllAsTouched();
        if (
            !this.addPersonalDetailForm.valid ||
            !this.addAddressDetailForm.valid
        ) {
            return;
        }
        this.addPersonalDetailForm;
        this.addAddressDetailForm;
        this.serviceEngineerDetailObject.slots = undefined;
        this.serviceEngineerDetailObject.zone_name = undefined;
        this.serviceEngineerDetailObject.slot_uuids = [];
        this.selectedSlotMaster.forEach((cat: SlotMaster) => {
            this.serviceEngineerDetailObject.slot_uuids.push(cat.uuid);
        });

        // this.serviceEngineerDetailObject.slot_uuid =
        //     this.selectedSlotMaster.uuid;
        this.serviceEngineerDetailObject.addresses.city =
            this.selectedCity?.name;
        this.serviceEngineerDetailObject.addresses.city_type =
            this.selectedCityType?.name;
        this.serviceEngineerDetailObject.addresses.zone_uuid =
            this.selectedZone?.uuid;
        this.serviceEngineerDetailObject.manager_uuid =
            this.selectedManager?.uuid;
        this.serviceEngineerDetailObject.roles = [];
        this.serviceEngineerDetailObject.roles.push(this.selectedRole?.name);
        this.serviceEngineerDetailObject.product_category_uuids = [];
        this.selectedProductCategoryList.forEach((cat: ProductCategory) => {
            this.serviceEngineerDetailObject.product_category_uuids.push(
                cat?.uuid
            );
        });
        this.serviceEngineerDetailObject.is_active = undefined;
        this.serviceEngineerDetailObject.zone_name = undefined;
        this.serviceEngineerDetailObject.last_name = undefined;
        this.serviceEngineerDetailObject.gender = undefined;
        this.serviceEngineerDetailObject.dob = undefined;
        this.serviceEngineerDetailObject.cost_allocated = undefined;
        this.serviceEngineerDetailObject.modules = undefined;
        this.serviceEngineerDetailObject.role = undefined;
        this.serviceEngineerDetailObject.product_category_uuid = undefined;
        this.serviceEngineerDetailObject.product_category_name = undefined;

        const fd = new FormData();
        fd.append("data", JSON.stringify(this.serviceEngineerDetailObject));
        this.productService
            .updateServiceEngineer(this.customerId, fd)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                    this.router.navigate(["/panel/service-person-management"]);
                },
                (err) => {
                    // this.sweetAlertService.errorAlert("Something Went Wrong!");
                    this.sweetAlertService.errorAlert(err.error.error);
                }
            );
    }

    getServiceEngineerRequest() {
        this.serviceRequestObject.service_person_uuid = this.customerId;
        this.serviceRequestService
            .getServiceEngineerRequest(this.serviceRequestObject)
            .subscribe(
                (data: any) => {
                    this.serviceRequestTableList = data.map((item: any) => {
                        let status = "";
                        if (!item.is_accepted && !item.is_rejected) {
                            status = "Pending";
                        } else if (!item.is_accepted && item.is_rejected) {
                            status = "Rejected";
                        } else if (item.is_accepted && !item.is_rejected) {
                            status = "Accepted";
                        }

                        return {
                            ...item,
                            status: status,

                            slotTime: `${this.formatTime(
                                item.slot?.start_time
                            )} - ${this.formatTime(item.slot?.end_time)}`,
                        };
                    });
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getServiceEngineerCalender() {
        this.serviceRequestObject.service_person_uuid = this.customerId;
        this.serviceRequestService
            .getServiceEngineerRequest(this.serviceRequestObject)
            .subscribe(
                (data: any) => {
                    this.getCalendarDataObj = data;
                    this.serviceEngineerRequestList = data.map((item: any) => {
                        let backgroundColor = "";
                        let title = "";
                        if (!item.is_accepted && !item.is_rejected) {
                            // status = "Unavailability";
                            backgroundColor = "red";
                        } else if (!item.is_accepted && item.is_rejected) {
                            // status = "Rejected";
                            backgroundColor = "";
                        } else if (item.is_accepted && !item.is_rejected) {
                            // status = "Accepted";
                            backgroundColor = "blue";
                        }

                        return {
                            start: item.date,
                            backgroundColor: backgroundColor,
                            id: item.id,
                            title: title,
                            hoverPointer: true,
                        };
                    });

                    this.calendarOptions.events =
                        this.serviceEngineerRequestList;
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    onEventClick(event: any) {
        const eventColor = event.event.backgroundColor;
        if (eventColor === "red") {
            this.openDialogUnavailability();
        } else if (eventColor === "blue") {
            this.openDialogAccepted();
        } else {
            return;
        }
    }

    openDialogUnavailability() {
        this.getCalendarDataObj.forEach((item: any) => {
            if (!item.is_accepted && !item.is_rejected) {
                this.getReasonsForUnavailability = item.title?.name;
                this.getSlotForUnavailability = item.slot?.slot_name;
                this.getSlotStartTimeForUnavailability = item.slot?.start_time;
                this.getSlotEndTimeForUnavailability = item.slot?.end_time;
            }
        });
        this.openDialogModuleForUnavailability = true;
    }

    openDialogAccepted() {
        this.getCalendarDataObj.forEach((item: any) => {
            if (item.is_accepted && !item.is_rejected) {
                this.getReasonsForAccepted = item.title?.name;
                this.getSlotForAccepted = item.slot?.slot_name;
                this.getSlotStartTimeForAccepted = item.slot?.start_time;
                this.getSlotEndTimeForAccepted = item.slot?.end_time;
            }
        });

        this.openDialogModuleForAccepted = true;
    }

    updateStatusRequest() {
        if (this.UpdateEngineerRequestObj.status === "Accepted") {
            this.UpdateEngineerRequestObj.is_accepted = true;
            this.UpdateEngineerRequestObj.is_rejected = false;
        } else if (this.UpdateEngineerRequestObj.status === "Rejected") {
            this.UpdateEngineerRequestObj.is_accepted = false;
            this.UpdateEngineerRequestObj.is_rejected = true;
        }
        this.UpdateEngineerRequestObj.status = undefined;
        this.productService
            .updateStatusRequest(
                this.UpdateEngineerRequestObj.user_uuid,
                this.UpdateEngineerRequestObj
            )
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                    this.getServiceEngineerRequest();
                    this.openDialogModuleForUpdateStatus = false;
                },
                (err) => {
                    this.sweetAlertService.errorAlert(err.error.message);
                    // this.sweetAlertService.errorAlert("Something Went Wrong!");
                    this.openDialogModuleForUpdateStatus = false;
                }
            );
    }

    deleteServiceDetails(event) {
        if (this.actionForEdit === false && this.actionForView === true) {
            return;
        }
        Swal.fire({
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.dismiss != null && result.dismiss != undefined) {
                Swal.close();
            } else {
                let delCustomer = this.serviceRequestObject;
                const customerId = event;
                delCustomer.uuid = customerId.uuid;
                this.serviceRequestService
                    .deleteServiceDetails(delCustomer.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Service Details successfully.",
                                "success"
                            );
                            this.getServiceEngineerDetails();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Service Details successfully.",
                                        "success"
                                    );
                                    this.getServiceEngineerDetails();
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    formatTime(time: string): string {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight

        return `${formattedHours}:${minutes
            .toString()
            .padStart(2, "0")} ${period}`;
    }

    searchParent(event) {
        this.manager.search_by = event.query;
        this.getManagers();
    }

    // getServiceDetailCount() {
    //     this.serviceRequestService
    //         .getServiceRequestCount(this.serviceRequestObject)
    //         .subscribe(
    //             (data: any) => {
    //                 this.totalRecords = data.count;

    //                 console.log(
    //                     "service Stats Count",
    //                     this.serviceRequestObject
    //                 );
    //             },
    //             (err) => {
    //                 console.log(err, "Error");
    //             }
    //         );
    // }
}
