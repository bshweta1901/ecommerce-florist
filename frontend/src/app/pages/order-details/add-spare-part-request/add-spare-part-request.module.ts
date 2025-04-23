import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AddSparePartRequestRoutingModule } from "./add-spare-part-request-routing.module";
import { AddSparePartRequestComponent } from "./add-spare-part-request.component";
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
import { TableModule } from "primeng/table";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomValidationModule } from "../../custom-validation/custom-validation.module";
import { MultiSelectModule } from "primeng/multiselect";
import { AutoCompleteModule } from "primeng/autocomplete";

@NgModule({
    declarations: [AddSparePartRequestComponent],
    imports: [
        CommonModule,
        AddSparePartRequestRoutingModule,
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
        MultiSelectModule,
        ButtonModule,
        TableModule,
        ReactiveFormsModule,
        CustomValidationModule,
        AutoCompleteModule,
    ],
    exports: [AddSparePartRequestComponent],
})
export class AddSparePartRequestModule {}
