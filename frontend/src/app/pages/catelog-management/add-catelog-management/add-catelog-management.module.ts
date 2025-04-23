import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AddCatelogManagementRoutingModule } from "./add-catelog-management-routing.module";
import { AddCatelogManagementComponent } from "./add-catelog-management.component";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { FileUploadModule } from "primeng/fileupload";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonTableModule } from "../../common-table/common-table.module";
import { CommonModalModule } from "../../common-modal/common-modal.module";
import { MultiSelectModule } from "primeng/multiselect";
import { CustomValidationModule } from "../../custom-validation/custom-validation.module";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";

@NgModule({
    declarations: [AddCatelogManagementComponent],
    imports: [
        CommonModule,
        AddCatelogManagementRoutingModule,
        InputTextModule,
        DropdownModule,
        FileUploadModule,
        FormsModule,
        CommonTableModule,
        CommonModalModule,
        MultiSelectModule,
        ReactiveFormsModule,
        CustomValidationModule,
        TableModule,
        TooltipModule,
    ],
})
export class AddCatelogManagementModule {}
