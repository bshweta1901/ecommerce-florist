import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SparePartManagementRoutingModule } from "./spare-part-management-routing.module";
import { SparePartManagementComponent } from "./spare-part-management.component";
import { PaginatorModule } from "primeng/paginator";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { CommonTableModule } from "../common-table/common-table.module";
import { CommonModalModule } from "../common-modal/common-modal.module";
import { AddProductModule } from "../add-product/add-product.module";
import { SidebarModule } from "primeng/sidebar";

@NgModule({
    declarations: [SparePartManagementComponent],
    imports: [
        CommonModule,
        SparePartManagementRoutingModule,
        PaginatorModule,
        ButtonModule,
        DividerModule,
        CommonTableModule,
        CommonModalModule,
        AddProductModule,
        SidebarModule,
    ],
})
export class SparePartManagementModule {}
