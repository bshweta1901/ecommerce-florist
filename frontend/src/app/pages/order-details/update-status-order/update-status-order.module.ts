import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UpdateStatusOrderRoutingModule } from "./update-status-order-routing.module";
import { UpdateStatusOrderComponent } from "./update-status-order.component";
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
import { ReactiveFormsModule } from "@angular/forms";
import { CustomValidationModule } from "../../custom-validation/custom-validation.module";

@NgModule({
    declarations: [UpdateStatusOrderComponent],
    imports: [
        CommonModule,
        UpdateStatusOrderRoutingModule,
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
        ReactiveFormsModule,
        CustomValidationModule,
    ],
    exports: [UpdateStatusOrderComponent],
})
export class UpdateStatusOrderModule {}
