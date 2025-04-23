import { Component, OnInit } from "@angular/core";
import { AppComponent } from "./app.component";
import { Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { MenuService } from "./app.menu.service";
import { AuthService } from "./service/auth.service";
import { AccessControlMaster } from "./model/AccessControlMaster.model";
import { expand } from "rxjs/operators";

@Component({
    selector: "app-menu",
    template: `
        <div class="layout-topbar-left">
            <!-- <div
                class="layout-topbar-logo"
                id="logolink"
                style="cursor: pointer; outline: none;"
            >
                <img
                    id="app-logo"
                    [src]="'assets/images/logo_allana_white.png'"
                    alt="Product Service App"
                    style="height: 40px;"
                />
                <img
                    id="app-logo-collapse"
                    [src]="'assets/images/logo_allana_white.png'"
                    alt="Product Service App"
                />
            </div> -->
            <div class="header-of-sidebar">
                <img src="assets/images/Logo1.png" />
            </div>
        </div>
        <ul class="layout-menu">
            <li
                app-menuitem
                *ngFor="let item of model; let i = index"
                [item]="item"
                [index]="i"
                [root]="true"
                (click)="removeItem()"
                [expanded]="item.expanded"
            ></li>
        </ul>
    `,
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    preprocessedTooltips: any;
    menuList: any[] = [];
    openSubMenus: { [key: string]: boolean } = {};
    accessControlMasterMap: { [moduleCode: string]: AccessControlMaster } = {};

    constructor(
        public app: AppComponent,
        private menuService: MenuService,
        public auth: AuthService
    ) {}

    ngOnInit() {
        //let accesscontrol = this.auth.getAccessControlListData();
        let item = [];
        let masterItem = [];
        this.toolTip();

        this.accessControlMasterMap = this.auth.getAccessControlMapData();
        console.log(this.accessControlMasterMap, "accesscontrol map data");

        // if (this.accessControlMasterMap['all'] !== null && this.accessControlMasterMap['all'] !== undefined &&
        //     this.accessControlMasterMap['all'].readAccess === true) {

        this.model = [
            {
                items: [
                    {
                        label: "Dashboard",
                        icon: "pi pi-home",
                        routerLink: ["/panel/dashboard"],
                        tooltip: "View the dashboard",
                        title: "",
                    },
                    {
                        label: "Customer Management",
                        icon: "pi pi-users",
                        routerLink: ["/panel/customer-management"],
                        tooltip: "View the Customer Management",
                    },
                    {
                        label: "Product Management",
                        icon: "pi pi-file-o",
                        routerLink: ["/panel/product-details"],
                        tooltip: "View the Product Details",
                    },
                ],
            },
            {
                label: "Master Management",
                icon: "pi pi-fw pi-wrench",
                items: [
                    {
                        label: "Category Master",
                        icon: "pi pi-chart-pie",
                        routerLink: ["/panel/spare-part-management"],
                        tooltip: "View the Spare Part Master",
                    },
                    {
                        label: "Sub Category Master",
                        icon: "pi pi-building",
                        routerLink: ["/panel/catelog-management"],
                        tooltip: "View the Product Catelog & Pricing",
                    },

                    {
                        label: "Pincode Master",
                        icon: "pi pi-user",
                        routerLink: ["/panel/service-person-management"],
                        tooltip: "View the Service Engineer",
                    },
                ],
            },
        
        ];
        // }else{

        //     if(this.accessControlMasterMap['overview'] !== null && this.accessControlMasterMap['overview'] !== undefined &&
        //         this.accessControlMasterMap['overview'].readAccess === true){
        //             this.model.push({
        //                 icon: "pi pi-fw pi-home",
        //                 items: [
        //                     {
        //                         label: "Overview",
        //                         icon: "pi pi-fw pi-home",
        //                         routerLink: ["/panel/dashboard"],
        //                     },
        //                 ],
        //             });
        //     }

        //     if(this.accessControlMasterMap['carcass-chiller'] !== null && this.accessControlMasterMap['carcass-chiller'] !== undefined &&
        //         this.accessControlMasterMap['carcass-chiller'].readAccess === true){
        //         item.push(
        //                 {
        //                     label: 'Carcass Chiller',
        //                     icon: 'pi pi-lock-open',
        //                     routerLink: ['/panel/carcass-chiller-mgnt'],
        //                 }
        //         );
        //     }

        //     if(this.accessControlMasterMap['debone'] !== null && this.accessControlMasterMap['debone'] !== undefined &&
        //         this.accessControlMasterMap['debone'].readAccess === true){
        //         item.push(
        //                 {
        //                     label: 'Debone',
        //                     icon: 'pi pi-chart-pie',
        //                     routerLink: ['/panel/debone-list'],
        //                 }
        //         );
        //     }

        //     if(this.accessControlMasterMap['plate-freezer'] !== null && this.accessControlMasterMap['plate-freezer'] !== undefined &&
        //         this.accessControlMasterMap['plate-freezer'].readAccess === true){
        //         item.push(
        //                 {
        //                     label: 'Plate Freezer',
        //                     icon: 'pi pi-shopping-bag',
        //                     routerLink: ['/panel/plate-freezer-mgnt'],
        //                 }
        //         );
        //     }

        //     if(this.accessControlMasterMap['blast-freezer'] !== null && this.accessControlMasterMap['blast-freezer'] !== undefined &&
        //         this.accessControlMasterMap['blast-freezer'].readAccess === true){
        //         item.push(
        //                 {
        //                     label: 'Blast Freezer',
        //                     icon: 'pi pi-bookmark-fill',
        //                     routerLink: ['/panel/blast-freezer-mgnt'],
        //                 }
        //         );
        //     }

        //     if(this.accessControlMasterMap['sampling'] !== null && this.accessControlMasterMap['sampling'] !== undefined &&
        //         this.accessControlMasterMap['sampling'].readAccess === true){
        //         item.push(
        //             {
        //                 label: 'Sampling Fresh',
        //                 icon: 'pi pi-info-circle',
        //                 routerLink: ['/panel/sampling-fresh-process'],
        //             },
        //             {
        //                 label: 'Sampling Frozen',
        //                 icon: 'pi pi-info-circle',
        //                 routerLink: ['/panel/sampling-frozen-process'],
        //             },
        //         );
        //     }

        //     // if(this.accessControlMasterMap['sampling-dqr'] !== null && this.accessControlMasterMap['sampling-dqr'] !== undefined &&
        //     //     this.accessControlMasterMap['sampling-dqr'].readAccess === true){
        //     //     item.push(
        //     //             {
        //     //                 label: 'Sampling - DQR',
        //     //                 icon: 'pi pi-circle',
        //     //                 routerLink: ['/panel/dqr-list'],
        //     //             }
        //     //     );
        //     // }

        //     // if(this.accessControlMasterMap['sampling-cqr'] !== null && this.accessControlMasterMap['sampling-cqr'] !== undefined &&
        //     //     this.accessControlMasterMap['sampling-cqr'].readAccess === true){
        //     //     item.push(
        //     //             {
        //     //                 label: 'Sampling - CQR',
        //     //                 icon: 'pi pi-history',
        //     //                 routerLink: ['/panel/cqr-list'],
        //     //             }
        //     //     );
        //     // }

        //     // if(this.accessControlMasterMap['sampling-give-away'] !== null && this.accessControlMasterMap['sampling-give-away'] !== undefined &&
        //     //     this.accessControlMasterMap['sampling-give-away'].readAccess === true){
        //     //     item.push(
        //     //             {
        //     //                 label: 'Sampling - Give Away',
        //     //                 icon: 'pi pi-box',
        //     //                 routerLink: ['/panel/give-away-list'],
        //     //             }
        //     //     );
        //     // }

        //     // if(this.accessControlMasterMap['sampling-metal-trapped'] !== null && this.accessControlMasterMap['sampling-metal-trapped'] !== undefined &&
        //     //     this.accessControlMasterMap['sampling-metal-trapped'].readAccess === true){
        //     //     item.push(
        //     //             {
        //     //                 label: 'Sampling - Metal Trapped',
        //     //                 icon: 'pi pi-stop-circle',
        //     //                 routerLink: ['/panel/metal-trap-list'],
        //     //             }
        //     //     );
        //     // }

        //     if(this.accessControlMasterMap['packaging'] !== null && this.accessControlMasterMap['packaging'] !== undefined &&
        //         this.accessControlMasterMap['packaging'].readAccess === true){
        //         item.push(
        //                 {
        //                     label: 'Packaging',
        //                     icon: 'pi pi-building',
        //                     //routerLink: ['/panel/#'],
        //                 }
        //         );
        //     }

        //     if(this.accessControlMasterMap['priniting'] !== null && this.accessControlMasterMap['priniting'] !== undefined &&
        //         this.accessControlMasterMap['priniting'].readAccess === true){
        //         item.push(
        //                 {
        //                     label: 'Printing',
        //                     icon: 'pi pi-shield',
        //                     //routerLink: ['/panel/#'],
        //                 }
        //         );
        //     }

        //     if(this.accessControlMasterMap['top-fitting'] !== null && this.accessControlMasterMap['top-fitting'] !== undefined &&
        //         this.accessControlMasterMap['top-fitting'].readAccess === true){
        //         item.push(
        //                 {
        //                     label: 'Top Fitting',
        //                     icon: 'pi pi-step-backward-alt',
        //                     //routerLink: ['/panel/#'],
        //                 }
        //         );
        //     }

        //     if(item.length>0)
        //     {
        //         this.model.push(
        //             {
        //                 label: 'Process Stage',
        //                 icon: 'pi pi-fw pi-cog',
        //                 items: item
        //             }
        //         )
        //     }

        //     if(this.accessControlMasterMap['staff'] !== null && this.accessControlMasterMap['staff'] !== undefined &&
        //         this.accessControlMasterMap['staff'].readAccess === true){
        //             masterItem.push(
        //                 {
        //                     label: "Staff",
        //                     icon: "pi pi-user",
        //                     routerLink: ["/panel/staff-list"],
        //                 }
        //         );
        //     }

        //     if(this.accessControlMasterMap['chiller-master'] !== null && this.accessControlMasterMap['chiller-master'] !== undefined &&
        //         this.accessControlMasterMap['chiller-master'].readAccess === true){
        //             masterItem.push(
        //                 {
        //                     label: 'Chiller Master',
        //                     icon: 'pi pi-info',
        //                     routerLink: ['/panel/chiller-list'],
        //                 }
        //         );
        //     }

        //     if(this.accessControlMasterMap['freezer-master'] !== null && this.accessControlMasterMap['freezer-master'] !== undefined &&
        //         this.accessControlMasterMap['freezer-master'].readAccess === true){
        //             masterItem.push(
        //                 {
        //                     label: 'Freezer Master',
        //                     icon: 'pi pi-info-circle',
        //                     routerLink: ['/panel/freezer-master'],
        //                 }
        //         );
        //     }

        //     if(this.accessControlMasterMap['sampling-master'] !== null && this.accessControlMasterMap['sampling-master'] !== undefined &&
        //         this.accessControlMasterMap['sampling-master'].readAccess === true){
        //             masterItem.push(
        //                 {
        //                     label: 'Sampling Fresh',
        //                     icon: 'pi pi-info-circle',
        //                     routerLink: ['/panel/sampling-fresh'],
        //                 },
        //                 {
        //                     label: 'Sampling Frozen',
        //                     icon: 'pi pi-info-circle',
        //                     routerLink: ['/panel/sampling-frozen'],
        //                 },
        //         );
        //     }

        //     if(this.accessControlMasterMap['product-master'] !== null && this.accessControlMasterMap['product-master'] !== undefined &&
        //         this.accessControlMasterMap['product-master'].readAccess === true){
        //             masterItem.push(
        //                 {
        //                     label: 'Product Master',
        //                     icon: 'pi pi-star-fill',
        //                     routerLink: ['/panel/product'],
        //                 }
        //         );
        //     }

        //     if(this.accessControlMasterMap['factory-master'] !== null && this.accessControlMasterMap['factory-master'] !== undefined &&
        //         this.accessControlMasterMap['factory-master'].readAccess === true){
        //             masterItem.push(
        //                 {
        //                     label: 'Factory Master',
        //                     icon: 'pi pi-pencil',
        //                     routerLink: ['/panel/factory-list'],
        //                 }
        //         );
        //     }

        //     if(this.accessControlMasterMap['unit-rate'] !== null && this.accessControlMasterMap['unit-rate'] !== undefined &&
        //         this.accessControlMasterMap['unit-rate'].readAccess === true){
        //             masterItem.push(
        //                 {
        //                     label: 'Unit Rate',
        //                     icon: 'pi pi-key',
        //                     routerLink: ['/panel/unit-rate-master'],
        //                 }
        //         );
        //     }

        //     // if(this.accessControlMasterMap['sop-master'] !== null && this.accessControlMasterMap['sop-master'] !== undefined &&
        //     //     this.accessControlMasterMap['sop-master'].readAccess === true){
        //     //         masterItem.push(
        //     //             {
        //     //                 label: 'SOP',
        //     //                 icon: 'pi pi-fw pi-list',
        //     //                 routerLink: ['/panel/sop-master'],
        //     //             }
        //     //     );
        //     // }

        //     if(masterItem.length > 0)
        //     {
        //         this.model.push(
        //             {
        //                 label: 'Master',
        //                 icon: 'pi pi-fw pi-wrench',
        //                 items: masterItem
        //             }
        //         )
        //     }
        // }
    }

    removeItem() {
        localStorage.removeItem("today_unassigned_stats");
        localStorage.removeItem("machine_in_repair_stats");
        localStorage.removeItem("oldSpare");
        localStorage.removeItem("overdue_sr_stats");
        localStorage.removeItem("pending_spare_part_stats");
        localStorage.removeItem("unavailable_engineer_stats");
    }
    toolTip() {
        const allTooltips = [];

        this.model.forEach((modelItem) => {
            modelItem.items.forEach((item) => {
                allTooltips.push(item.tooltip);
            });
        });

        console.log("Preprocessed tooltips:", allTooltips); // This should now log the tooltips correctly
    }

    toggleSubMenu(menu: string) {
        this.openSubMenus[menu] = !this.openSubMenus[menu];
    }

    isSubMenuOpen(menu: string): boolean {
        return this.openSubMenus[menu] || false;
    }

    // refreshMenu() {
    //     // Logic to refresh your app menu component
    //     const sessiondata = this.projectService.getProjectSession();
    //     console.log(sessiondata);
    //     if(sessiondata && sessiondata.projectName){
    //         this.subMenu = true;
    //     }else{
    //         this.subMenu = false;
    //     }
    // }
}
