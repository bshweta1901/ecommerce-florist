import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EditProductCategoryRoutingModule } from "./edit-product-category-routing.module";
import { EditProductCategoryComponent } from "./edit-product-category.component";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { PaginatorModule } from "primeng/paginator";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";

@NgModule({
    declarations: [EditProductCategoryComponent],
    imports: [
        CommonModule,
        EditProductCategoryRoutingModule,
        InputTextModule,
        InputNumberModule,
        PaginatorModule,
        ButtonModule,
        DividerModule,
    ],
    exports: [EditProductCategoryComponent],
})
export class EditProductCategoryModule {}
