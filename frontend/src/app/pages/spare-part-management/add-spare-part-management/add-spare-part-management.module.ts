import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AddSparePartManagementRoutingModule } from "./add-spare-part-management-routing.module";
import { AddSparePartManagementComponent } from "./add-spare-part-management.component";
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
import { MultiSelectModule } from "primeng/multiselect";
import { AddCreateOrderModule } from "../../customer-management/create-order-customer/add-create-order/add-create-order.module";
import { CustomValidationModule } from "../../custom-validation/custom-validation.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [AddSparePartManagementComponent],
    imports: [
        CommonModule,
        AddSparePartManagementRoutingModule,
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
        ButtonModule,
        MultiSelectModule,
        AddCreateOrderModule,
        ReactiveFormsModule,
        CustomValidationModule,
    ],
})
export class AddSparePartManagementModule {}
