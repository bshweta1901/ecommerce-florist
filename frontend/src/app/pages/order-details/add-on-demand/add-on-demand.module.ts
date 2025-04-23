import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AddOnDemandRoutingModule } from "./add-on-demand-routing.module";
import { AddOnDemandComponent } from "./add-on-demand.component";
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
import { AutoCompleteModule } from "primeng/autocomplete";

@NgModule({
    declarations: [AddOnDemandComponent],
    imports: [
        CommonModule,
        AddOnDemandRoutingModule,
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
        AutoCompleteModule,
    ],
    exports: [AddOnDemandComponent],
})
export class AddOnDemandModule {}
