import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateOrderCustomerRoutingModule } from "./create-order-customer-routing.module";
import { CreateOrderCustomerComponent } from "./create-order-customer.component";
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
import { AddCreateOrderModule } from "./add-create-order/add-create-order.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomValidationModule } from "../../custom-validation/custom-validation.module";

@NgModule({
    declarations: [CreateOrderCustomerComponent],
    imports: [
        CommonModule,
        CreateOrderCustomerRoutingModule,
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
        FormsModule
    ],
})
export class CreateOrderCustomerModule {}
