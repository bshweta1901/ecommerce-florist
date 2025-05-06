import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppMainComponent } from "./app.main.component";
import { DashboardDemoComponent } from "./demo/view/dashboarddemo.component";
import { AppAccessdeniedComponent } from "./pages/app.accessdenied.component";
import { AppErrorComponent } from "./pages/app.error.component";
import { AppLoginComponent } from "./pages/app.login.component";
import { AppNotfoundComponent } from "./pages/app.notfound.component";
import { AddCatelogManagementComponent } from "./pages/catelog-management/add-catelog-management/add-catelog-management.component";
import { CatelogManagementComponent } from "./pages/catelog-management/catelog-management.component";
import { AddCustomerClientComponent } from "./pages/customer-management/add-customer-client/add-customer-client.component";
import { CreateOrderCustomerComponent } from "./pages/customer-management/create-order-customer/create-order-customer.component";
import { CustomerManagementComponent } from "./pages/customer-management/customer-management.component";
import { ServiceRequestManagementComponent } from "./pages/service-request-management/service-request-management.component";
import { StatusServiceRequestManagementComponent } from "./pages/service-request-management/status-service-request-management/status-service-request-management.component";
import { AddSparePartManagementComponent } from "./pages/spare-part-management/add-spare-part-management/add-spare-part-management.component";
import { ServicePersonManagementComponent } from "./pages/service-person-management/service-person-management.component";
import { AddServicePersonManagementComponent } from "./pages/service-person-management/add-service-person-management/add-service-person-management.component";
import { MasterSettingComponent } from "./pages/master-setting/master-setting.component";
import { OrderDetailsComponent } from "./pages/order-details/order-details.component";
import { SparePartManagementComponent } from "./pages/spare-part-management/spare-part-management.component";
import { StaffListComponent } from "./pages/staff-list/staff-list.component";
import { AgreementComponent } from "./pages/customer-management/agreement/agreement.component";
import { UpdateStatusOrderComponent } from "./pages/order-details/update-status-order/update-status-order.component";
import { ServiceSparePartComponent } from "./pages/service-spare-part/service-spare-part.component";
import { ProductManagementComponent } from "./pages/product-management/product-management.component";
import { CategoryManagementComponent } from "./pages/category-management/category-management.component";
import { AddCategoryManagementComponent } from "./pages/add-category-management/add-category-management.component";
import { SubCategoryMangementComponent } from "./pages/sub-category-mangement/sub-category-mangement.component";
import { AddSubCategoryComponent } from "./pages/add-sub-category/add-sub-category.component";
import { AddProductComponent } from "./pages/add-product/add-product.component";
import { ProductAddOnComponent } from "./pages/product-add-on/product-add-on.component";
import { AddProductAddOnComponent } from "./pages/add-product-add-on/add-product-add-on.component";
// import { SubCategoryComponent } from "./pages/sub-category/sub-category.component";
// import { AddSubCategoryComponent } from "./pages/add-sub-category/add-sub-category.component";

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: "panel",
                    component: AppMainComponent,
                    children: [
                        {
                            path: "dashboard",
                            component: DashboardDemoComponent,
                            // canActivate: [AuthGuard]
                        },

                        { path: "staff-list", component: StaffListComponent },
                        { path: "sub-category", component: SubCategoryMangementComponent },
                        {
                            path: "add-sub-category",
                            component: AddSubCategoryComponent,
                        },
                        {
                            path: "add-product",
                            component: AddProductComponent,
                        },
                        {
                            path: "product-list",
                            component: ProductManagementComponent,
                        },
                        {
                            path: "add-on-list",
                            component: ProductAddOnComponent,
                        },
                        {
                            path: "add-on",
                            component: AddProductAddOnComponent,
                        },
                        {
                            path: "category-management",
                            component: CategoryManagementComponent,
                        },
                        {
                            path: "add-client",
                            component: AddCustomerClientComponent,
                        },
                        {
                            path: "add-client/:id",
                            component: AddCustomerClientComponent,
                        },
                        {
                            path: "create-order-customer",
                            component: CreateOrderCustomerComponent,
                        },
                        {
                            path: "create-order-customer/:id",
                            component: CreateOrderCustomerComponent,
                        },
                        {
                            path: "catelog-management",
                            component: CatelogManagementComponent,
                        },
                        {
                            path: "add-catelog-management",
                            component: AddCatelogManagementComponent,
                        },
                        {
                            path: "add-catelog-management/:id",
                            component: AddCatelogManagementComponent,
                        },
                        {
                            path: "service-request-management",
                            component: ServiceRequestManagementComponent,
                        },
                        {
                            path: "status-service-request-management",
                            component: StatusServiceRequestManagementComponent,
                        },
                        {
                            path: "add-category",
                            component: AddCategoryManagementComponent,
                        },
                        {
                            path: "status-service-request-management/:id",
                            component: StatusServiceRequestManagementComponent,
                        },
                        {
                            path: "spare-part-management",
                            component: SparePartManagementComponent,
                        },
                        {
                            path: "add-spare-part-management",
                            component: AddSparePartManagementComponent,
                        },
                        {
                            path: "add-spare-part-management/:id",
                            component: AddSparePartManagementComponent,
                        },
                        {
                            path: "service-person-management",
                            component: ServicePersonManagementComponent,
                        },
                        {
                            path: "add-service-person-management",
                            component: AddServicePersonManagementComponent,
                        },
                        {
                            path: "add-service-person-management/:id",
                            component: AddServicePersonManagementComponent,
                        },
                        {
                            path: "order-details",
                            component: OrderDetailsComponent,
                        },
                        {
                            path: "master-setting",
                            component: MasterSettingComponent,
                        },
                        {
                            path: "update-status-order",
                            component: UpdateStatusOrderComponent,
                        },
                        {
                            path: "service-spare-part",
                            component: ServiceSparePartComponent,
                        },
                    ],
                },
                {
                    path: "sign-agreement/:id",
                    component: AgreementComponent,
                },
                { path: "error", component: AppErrorComponent },
                { path: "access", component: AppAccessdeniedComponent },
                { path: "notfound", component: AppNotfoundComponent },
                { path: "", component: AppLoginComponent },
                // { path: 'form', loadChildren: () => import('./pages/form/form.module').then(m => m.FormModule) },
                {
                    path: "common-table",
                    loadChildren: () =>
                        import("./pages/common-table/common-table.module").then(
                            (m) => m.CommonTableModule
                        ),
                },
                {
                    path: "pagination",
                    loadChildren: () =>
                        import("./pages/pagination/pagination.module").then(
                            (m) => m.PaginationModule
                        ),
                },
                // { path: 'modal', loadChildren: () => import('./pages/modal/modal.module').then(m => m.ModalModule) },
                // { path: 'organisation-management', loadChildren: () => import('./pages/organisation-management/organisation-management.module').then(m => m.OrganisationManagementModule) },
                {
                    path: "common-modal",
                    loadChildren: () =>
                        import("./pages/common-modal/common-modal.module").then(
                            (m) => m.CommonModalModule
                        ),
                },
                {
                    path: "access-control-master",
                    loadChildren: () =>
                        import(
                            "./pages/access-control-master/access-control-master.module"
                        ).then((m) => m.AccessControlMasterModule),
                },
                {
                    path: "add-staff",
                    loadChildren: () =>
                        import("./pages/add-staff/add-staff.module").then(
                            (m) => m.AddStaffModule
                        ),
                },
                {
                    path: "staff-list",
                    loadChildren: () =>
                        import("./pages/staff-list/staff-list.module").then(
                            (m) => m.StaffListModule
                        ),
                },
                {
                    path: "product",
                    loadChildren: () =>
                        import(
                            "./pages/product-management/product-management.module"
                        ).then((m) => m.ProductManagementModule),
                },
                {
                    path: "add-product",
                    loadChildren: () =>
                        import("./pages/add-product/add-product.module").then(
                            (m) => m.AddProductModule
                        ),
                },
                {
                    path: "add-category",
                    loadChildren: () =>
                        import("./pages/add-category-management/add-category-management.module").then(
                            (m) => m.AddCategoryManagementModule
                        ),
                },
                {
                    path: "add-factory",
                    loadChildren: () =>
                        import("./pages/add-factory/add-factory.module").then(
                            (m) => m.AddFactoryModule
                        ),
                },
                {
                    path: "reports",
                    loadChildren: () =>
                        import("./pages/reports/reports.module").then(
                            (m) => m.ReportsModule
                        ),
                },
                { path: "**", redirectTo: "/notfound" },
                {
                    path: "report",
                    loadChildren: () =>
                        import("./pages/report/report.module").then(
                            (m) => m.ReportModule
                        ),
                },
                {
                    path: "customer-management",
                    loadChildren: () =>
                        import(
                            "./pages/customer-management/customer-management.module"
                        ).then((m) => m.CustomerManagementModule),
                },
                {
                    path: "Add-Customer-Client",
                    loadChildren: () =>
                        import(
                            "./pages/customer-management/add-customer-client/add-customer-client.module"
                        ).then((m) => m.AddCustomerClientModule),
                },
                {
                    path: "Create-Order-Customer",
                    loadChildren: () =>
                        import(
                            "./pages/customer-management/add-customer-client/add-customer-client.module"
                        ).then((m) => m.AddCustomerClientModule),
                },
                {
                    path: "Create-Order-Customer",
                    loadChildren: () =>
                        import(
                            "./pages/customer-management/create-order-customer/create-order-customer.module"
                        ).then((m) => m.CreateOrderCustomerModule),
                },
                {
                    path: "catelog-management",
                    loadChildren: () =>
                        import(
                            "./pages/catelog-management/catelog-management.module"
                        ).then((m) => m.CatelogManagementModule),
                },
                {
                    path: "add-catelog-management",
                    loadChildren: () =>
                        import(
                            "./pages/catelog-management/add-catelog-management/add-catelog-management.module"
                        ).then((m) => m.AddCatelogManagementModule),
                },
                {
                    path: "service-request-management",
                    loadChildren: () =>
                        import(
                            "./pages/service-request-management/service-request-management.module"
                        ).then((m) => m.ServiceRequestManagementModule),
                },
                {
                    path: "status-service-request-management",
                    loadChildren: () =>
                        import(
                            "./pages/service-request-management/status-service-request-management/status-service-request-management.module"
                        ).then((m) => m.StatusServiceRequestManagementModule),
                },
                {
                    path: "spare-part-management",
                    loadChildren: () =>
                        import(
                            "./pages/spare-part-management/spare-part-management.module"
                        ).then((m) => m.SparePartManagementModule),
                },
                {
                    path: "add-spare-part-management",
                    loadChildren: () =>
                        import(
                            "./pages/spare-part-management/add-spare-part-management/add-spare-part-management.module"
                        ).then((m) => m.AddSparePartManagementModule),
                },
                {
                    path: "service-person-management",
                    loadChildren: () =>
                        import(
                            "./pages/service-person-management/service-person-management.module"
                        ).then((m) => m.ServicePersonManagementModule),
                },
                {
                    path: "add-service-person-management",
                    loadChildren: () =>
                        import(
                            "./pages/service-person-management/add-service-person-management/add-service-person-management.module"
                        ).then((m) => m.AddServicePersonManagementModule),
                },
                {
                    path: "master-setting",
                    loadChildren: () =>
                        import(
                            "./pages/master-setting/master-setting.module"
                        ).then((m) => m.MasterSettingModule),
                },
                {
                    path: "order-details",
                    loadChildren: () =>
                        import(
                            "./pages/order-details/order-details.module"
                        ).then((m) => m.OrderDetailsModule),
                },
                {
                    path: "add-spare-part-request",
                    loadChildren: () =>
                        import(
                            "./pages/order-details/add-spare-part-request/add-spare-part-request.module"
                        ).then((m) => m.AddSparePartRequestModule),
                },
                {
                    path: "add-on-demand",
                    loadChildren: () =>
                        import(
                            "./pages/order-details/add-on-demand/add-on-demand.module"
                        ).then((m) => m.AddOnDemandModule),
                },
                {
                    path: "update-status-order",
                    loadChildren: () =>
                        import(
                            "./pages/order-details/update-status-order/update-status-order.module"
                        ).then((m) => m.UpdateStatusOrderModule),
                },
                {
                    path: "edit-product-category",
                    loadChildren: () =>
                        import(
                            "./pages/master-setting/edit-product-category/edit-product-category.module"
                        ).then((m) => m.EditProductCategoryModule),
                },
                {
                    path: "service-spare-part",
                    loadChildren: () =>
                        import(
                            "./pages/service-spare-part/service-spare-part.module"
                        ).then((m) => m.ServiceSparePartModule),
                },
            { path: 'category-management', loadChildren: () => import('./pages/category-management/category-management.module').then(m => m.CategoryManagementModule) },
            { path: 'add-category-management', loadChildren: () => import('./pages/add-category-management/add-category-management.module').then(m => m.AddCategoryManagementModule) },
            { path: 'banner-managment', loadChildren: () => import('./pages/banner-managment/banner-managment.module').then(m => m.BannerManagmentModule) },
            { path: 'sub-category-mangement', loadChildren: () => import('./pages/sub-category-mangement/sub-category-mangement.module').then(m => m.SubCategoryMangementModule) },
            { path: 'add-sub-category', loadChildren: () => import('./pages/add-sub-category/add-sub-category.module').then(m => m.AddSubCategoryModule) },
            { path: 'product-add-on', loadChildren: () => import('./pages/product-add-on/product-add-on.module').then(m => m.ProductAddOnModule) },
            { path: 'add-product-add-on', loadChildren: () => import('./pages/add-product-add-on/add-product-add-on.module').then(m => m.AddProductAddOnModule) },
                { path: "**", redirectTo: "/notfound" },
            ],
            { scrollPositionRestoration: "enabled" }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
