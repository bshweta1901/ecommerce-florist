import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AddServicePersonManagementRoutingModule } from "./add-service-person-management-routing.module";
import { AddServicePersonManagementComponent } from "./add-service-person-management.component";
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
import { FullCalendarModule } from "@fullcalendar/angular";
import { MultiSelectModule } from "primeng/multiselect";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomValidationModule } from "../../custom-validation/custom-validation.module";
import { RadioButtonModule } from "primeng/radiobutton";
import { AutoCompleteModule } from "primeng/autocomplete";

@NgModule({
    declarations: [AddServicePersonManagementComponent],
    imports: [
        CommonModule,
        AddServicePersonManagementRoutingModule,
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
        FullCalendarModule,
        MultiSelectModule,
        ReactiveFormsModule,
        CustomValidationModule,
        RadioButtonModule,
        AutoCompleteModule,
    ],
    providers: [],
    bootstrap: [],
})
export class AddServicePersonManagementModule {}
