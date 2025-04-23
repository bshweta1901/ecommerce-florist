import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

import { StatusServiceRequestManagementRoutingModule } from "./status-service-request-management-routing.module";
import { StatusServiceRequestManagementComponent } from "./status-service-request-management.component";
import { TabViewModule } from "primeng/tabview";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { FileUploadModule } from "primeng/fileupload";
import { PaginatorModule } from "primeng/paginator";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { CommonTableModule } from "../../common-table/common-table.module";
import { CommonModalModule } from "../../common-modal/common-modal.module";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomValidationModule } from "../../custom-validation/custom-validation.module";
import { RadioButtonModule } from "primeng/radiobutton";

@NgModule({
    declarations: [StatusServiceRequestManagementComponent],
    imports: [
        CommonModule,
        StatusServiceRequestManagementRoutingModule,
        TabViewModule,
        InputTextModule,
        InputNumberModule,
        FileUploadModule,
        CommonModule,
        PaginatorModule,
        ButtonModule,
        DividerModule,
        CommonTableModule,
        CommonModalModule,
        InputTextareaModule,
        CheckboxModule,
        DropdownModule,
        ButtonModule,
        CalendarModule,
        ReactiveFormsModule,
        CustomValidationModule,
        RadioButtonModule,
    ],
    providers: [DatePipe],
})
export class StatusServiceRequestManagementModule {}
