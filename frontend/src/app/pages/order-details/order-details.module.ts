import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OrderDetailsRoutingModule } from "./order-details-routing.module";
import { OrderDetailsComponent } from "./order-details.component";
import { PaginatorModule } from "primeng/paginator";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { CommonTableModule } from "../common-table/common-table.module";
import { CommonModalModule } from "../common-modal/common-modal.module";
import { AddProductModule } from "../add-product/add-product.module";
import { SidebarModule } from "primeng/sidebar";
import { AddSparePartRequestModule } from "./add-spare-part-request/add-spare-part-request.module";
import { AddOnDemandModule } from "./add-on-demand/add-on-demand.module";
import { UpdateStatusOrderModule } from "./update-status-order/update-status-order.module";
import { CalendarModule } from "primeng/calendar";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomValidationModule } from "../custom-validation/custom-validation.module";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";

@NgModule({
    declarations: [OrderDetailsComponent],
    imports: [
        CommonModule,
        OrderDetailsRoutingModule,
        PaginatorModule,
        ButtonModule,
        DividerModule,
        CommonTableModule,
        CommonModalModule,
        AddProductModule,
        SidebarModule,
        AddSparePartRequestModule,
        AddOnDemandModule,
        UpdateStatusOrderModule,
        CalendarModule,
        ReactiveFormsModule,
        CustomValidationModule,
        InputTextModule,
        InputNumberModule,
    ],
})
export class OrderDetailsModule {}
