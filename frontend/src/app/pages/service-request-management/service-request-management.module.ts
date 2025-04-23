import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ServiceRequestManagementRoutingModule } from "./service-request-management-routing.module";
import { ServiceRequestManagementComponent } from "./service-request-management.component";
import { CommonTableModule } from "../common-table/common-table.module";
import { DropdownModule } from "primeng/dropdown";
import { SidebarModule } from "primeng/sidebar";
import { PaginatorModule } from "primeng/paginator";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";

@NgModule({
    declarations: [ServiceRequestManagementComponent],
    imports: [
        CommonModule,
        ServiceRequestManagementRoutingModule,
        CommonTableModule,
        DropdownModule,
        SidebarModule,
        PaginatorModule,
        ButtonModule,
        DividerModule,
    ],
})
export class ServiceRequestManagementModule {}
