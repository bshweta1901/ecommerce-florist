import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ServiceSparePartRoutingModule } from "./service-spare-part-routing.module";
import { ServiceSparePartComponent } from "./service-spare-part.component";
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
import { SidebarModule } from "primeng/sidebar";
import { RadioButtonModule } from "primeng/radiobutton";

@NgModule({
    declarations: [ServiceSparePartComponent],
    imports: [
        CommonModule,
        ServiceSparePartRoutingModule,
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
        SidebarModule,
        RadioButtonModule,
    ],
})
export class ServiceSparePartModule {}
