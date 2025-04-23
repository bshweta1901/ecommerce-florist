import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ServicePersonManagementRoutingModule } from "./service-person-management-routing.module";
import { ServicePersonManagementComponent } from "./service-person-management.component";
import { TabViewModule } from "primeng/tabview";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { FileUploadModule } from "primeng/fileupload";
import { PaginatorModule } from "primeng/paginator";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { CommonTableModule } from "../common-table/common-table.module";
import { CommonModalModule } from "../common-modal/common-modal.module";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { SidebarModule } from "primeng/sidebar";

@NgModule({
    declarations: [ServicePersonManagementComponent],
    imports: [
        CommonModule,
        ServicePersonManagementRoutingModule,
        TabViewModule,
        InputTextModule,
        InputNumberModule,
        FileUploadModule,
        PaginatorModule,
        ButtonModule,
        DividerModule,
        CommonTableModule,
        CommonModalModule,
        InputTextareaModule,
        CheckboxModule,
        DropdownModule,
        SidebarModule,
    ],
})
export class ServicePersonManagementModule {}
