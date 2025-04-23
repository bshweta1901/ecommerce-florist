import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MasterSettingRoutingModule } from "./master-setting-routing.module";
import { MasterSettingComponent } from "./master-setting.component";
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
import { EditProductCategoryModule } from "./edit-product-category/edit-product-category.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomValidationModule } from "../custom-validation/custom-validation.module";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";

@NgModule({
    declarations: [MasterSettingComponent],
    imports: [
        CommonModule,
        MasterSettingRoutingModule,
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
        EditProductCategoryModule,
        ReactiveFormsModule,
        CustomValidationModule,
        CalendarModule,
        MultiSelectModule,
    ],
})
export class MasterSettingModule {}
