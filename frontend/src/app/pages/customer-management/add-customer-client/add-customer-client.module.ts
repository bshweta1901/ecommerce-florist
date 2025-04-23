import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AddCustomerClientRoutingModule } from "./add-customer-client-routing.module";
import { AddCustomerClientComponent } from "./add-customer-client.component";
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
import { CustomValidationComponent } from "../../custom-validation/custom-validation.component";
import { CustomValidationModule } from "../../custom-validation/custom-validation.module";
import { AutoCompleteModule } from "primeng/autocomplete";
import { TooltipModule } from "primeng/tooltip";
@NgModule({
    declarations: [AddCustomerClientComponent],
    imports: [
        CommonModule,
        AddCustomerClientRoutingModule,
        TabViewModule,
        InputTextModule,
        InputNumberModule,
        CustomValidationModule,
        FileUploadModule,
        CommonModule,
        PaginatorModule,
        ButtonModule,
        DividerModule,
        CommonTableModule,
        CommonModalModule,
        CalendarModule,
        InputTextareaModule,
        CheckboxModule,
        DropdownModule,
        ButtonModule,
        ReactiveFormsModule,
        AutoCompleteModule,
        TooltipModule,
    ],
})
export class AddCustomerClientModule {}
