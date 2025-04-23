import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddCreateOrderRoutingModule } from "./add-create-order-routing.module";
import { AddCreateOrderComponent } from "./add-create-order.component";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [AddCreateOrderComponent],
    imports: [CommonModule, AddCreateOrderRoutingModule, InputTextModule,FormsModule],
    exports: [AddCreateOrderComponent],
})
export class AddCreateOrderModule {}
