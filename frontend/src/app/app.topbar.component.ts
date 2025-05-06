import { Component } from "@angular/core";
import { AppComponent } from "./app.component";
import { AppMainComponent } from "./app.main.component";
import { SessionClient } from "./configuration/sessionclientstorage";
import { Router } from "@angular/router";
import { User } from "./model/User.model";
import { AuthService } from "./service/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { CustomerService } from "./service/customerservice";
import { Notification } from "./model/Notification.model";
import { FactoryService } from "./service/factory.service";
import { Factory } from "./model/Factory.model";
@Component({
    selector: "app-topbar",
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-wrapper">
                <div class="layout-topbar-right">
                    <!--<a class="menu-button" href="#" (click)="appMain.onMenuButtonClick($event)">
                        <i class="pi pi-bars"></i>
                    </a>-->

                    <div *ngIf="isDashboardRoute(); else otherRouteContent">
                        <h5 style="margin: 8px 10px 4px 10px;">
                            Ecommerce App
                        </h5>
                        <p
                            style="margin-top: 0px; margin-left:18px ; color: #323639;"
                        >
                            Here are today's stats
                        </p>
                    </div>

                    <ng-template #otherRouteContent>
                        <button
                            type="button"
                            id="topnav-hamburger-icon"
                            class="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
                            (click)="appMain.onMenuButtonClick($event)"
                        >
                            <span class="hamburger-icon">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>
                        <h5 style="margin: 0px;">
                            Welcome back, Admin {{ this.userId?.firstName }}
                        </h5>
                    </ng-template>

                    <ul class="layout-topbar-actions">
                        <!-- <li>
                            <p-dropdown inputId="multiselect" [options]="factoryList" 
                            optionLabel="factoryName" (onChange)="changeFactory($event)" [(ngModel)]="selectedFactory"
                            ></p-dropdown>
                        </li> -->

                        <li
                            #notifications
                            class="topbar-item notifications"
                            [ngClass]="{
                                'active-topmenuitem':
                                    appMain.activeTopbarItem === notifications
                            }"
                        >
                            <a
                                href="#"
                                (click)="
                                    appMain.onTopbarItemClick(
                                        $event,
                                        notifications
                                    )
                                "
                            >
                                <span class="p-overlay-badge topbar-icon">
                                    <i
                                        class="pi pi-bell"
                                        pBadge
                                        *ngIf="notificationCount"
                                        value="{{ notificationCount }}"
                                    ></i>
                                    <i
                                        class="pi pi-bell"
                                        pBadge
                                        *ngIf="!notificationCount"
                                        value="0"
                                    ></i>
                                </span>
                            </a>
                            <ul class="fadeInDown">
                                <li class="layout-submenu-header">
                                    <h6
                                        class="header-text"
                                        *ngIf="notificationList"
                                    >
                                        Notifications
                                    </h6>
                                    <h6
                                        class="header-text"
                                        *ngIf="!notificationList"
                                    >
                                        No Notifications
                                    </h6>
                                    <span class="p-badge">{{
                                        notificationCount
                                    }}</span>
                                </li>
                                <div
                                    class="notification-wrap"
                                    style="text-align: center;max-height: 300px;overflow-y: auto;margin-bottom: 1rem;"
                                >
                                    <li
                                        role="menuitem"
                                        *ngFor="
                                            let notification of notificationList;
                                            index as i
                                        "
                                    >
                                        <a
                                            href="#"
                                            (click)="
                                                appMain.onTopbarSubItemClick(
                                                    $event
                                                )
                                            "
                                        >
                                            <div class="notifications-item">
                                                <h6>
                                                    {{ notification.title }}
                                                </h6>
                                                <span [ngStyle]="getStyle(i)">{{
                                                    notification.title
                                                }}</span>
                                            </div>
                                        </a>
                                    </li>
                                </div>
                            </ul>
                        </li>

                        <li
                            #profile
                            class="topbar-item user-profile"
                            [ngClass]="{
                                'active-topmenuitem':
                                    appMain.activeTopbarItem === profile
                            }"
                        >
                            <a href="#" (click)="logout()" class="profile-link">
                                <!-- <img
                                    class="profile-image"
                                    src="assets/images/users/profile.png"
                                    alt="demo"
                                /> -->
                                <div class="profile-info">
                                    <h6 (click)="logout()">Logout</h6>
                                </div>
                            </a>

                            <ul class="fadeInDown">
                                <li role="menuitem">
                                    <a href="#" (click)="logout()">
                                        <i class="pi pi-power-off"></i>
                                        <h6>Logout</h6>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <!-- <a class="layout-rightpanel-button" href="#" (click)="appMain.onRightPanelButtonClick($event)">
                        <i class="pi pi-arrow-left"></i>
                    </a> -->
                </div>
            </div>
        </div>
    `,
})
export class AppTopBarComponent {
    getRemoteConfigResponse: any;
    getUserSession: any;
    factory: Factory = new Factory();
    userId: any;
    notification: Notification = new Notification();
    notificationCount: number;
    notificationList: any[];
    factoryList: any[];
    selectedFactory: any;
    constructor(
        public appMain: AppMainComponent,
        public factoryService: FactoryService,
        public app: AppComponent,
        public authService: AuthService,
        public customerService: CustomerService,
        public sessionClient: SessionClient,
        public router: Router
    ) {}

    ngOnInit(): void {
        this.getRemoteConfigResponse = this.authService.geRemoteConfigData();
        this.getUserSession = this.authService.getUserSession();
        // this.userId = this.getUserSession["data"];
        this.userId = this.getUserSession?.["data"] ?? null;
        //console.log(this.userId, 'user details');
        let toUserIdString = [];
        toUserIdString.push(this.userId);
        this.notification.toUserId = "[" + toUserIdString.join(",") + "]";
        this.getNotificationList(this.notification);
        this.getNotificationCount(this.notification);
        this.readNotification();
    }

    isDashboardRoute(): boolean {
        return this.router.url === "/panel/product-list";
    }

    getFactoryList() {
        this.getUserSession = this.authService.getUserSession();
        if (this.getUserSession) {
            this.factoryList = this.getUserSession.data.factoryUserList;

            const factoryFromSession = this.factoryService.getFactorySession();

            if (factoryFromSession) {
                this.selectedFactory =
                    this.factoryList.find(
                        (factory) => factory.id === factoryFromSession.id
                    ) || new Factory();
            }

            if (!this.selectedFactory && this.factoryList.length > 0) {
                this.selectedFactory = this.factoryList[0];
                this.factoryService.setFactorySession(this.selectedFactory);
            }
        }

        const { protocol, hostname, port, pathname, hash } = window.location;
        let baseUrl = `${protocol}//${hostname}`;
        if (port) {
            baseUrl += `:${port}`;
        }
        const fullUrl = window.location.href;

        //console.log(hash, 'url');
        if (fullUrl == baseUrl + "/#/panel/carcass-chiller-deatils") {
            this.router.navigateByUrl("panel/carcass-chiller-mgnt");
        }

        if (fullUrl == baseUrl + "/#/panel/view-logs") {
            this.router.navigateByUrl("panel/chiller-list");
        }

        if (fullUrl == baseUrl + "/#/panel/blast-freezer-details") {
            this.router.navigateByUrl("panel/blast-freezer-mgnt");
        }

        if (fullUrl == baseUrl + "/#/panel/plate-freezer-details") {
            this.router.navigateByUrl("panel/plate-freezer-mgnt");
        }

        if (fullUrl == baseUrl + "/#/panel/freezer-view-logs") {
            this.router.navigateByUrl("panel/freezer-master");
        }
    }

    changeFactory(event) {
        this.factoryService.setFactorySession(event.value);
        location.reload();
    }

    public logout(): void {
        // Clear all session data
        // let rememberTemp = localStorage.getItem("savedEmail");
        localStorage.clear();
        localStorage.removeItem("userSession");
        localStorage.removeItem("savedEmail");
        // this.sessionClient.signOut();

        // Clear everything except 'savedEmail' if 'Remember Me' is enabled
        // if (rememberTemp!=null && rememberTemp!=undefined) {
        //     localStorage.setItem("savedEmail",rememberTemp)
        // }

        setTimeout(() => {
            this.router.navigateByUrl("/");
            window.location.reload();
        }, 500);
    }

    getNotificationList(notification) {
        this.customerService.getNotificationList(notification).subscribe(
            (data) => {
                this.notificationList = data;
                console.log("Notification List", this.notificationList);
            },
            (err: HttpErrorResponse) => {
                if (err.status === 200) {
                    //json circular break at server side always add
                    //extra information of timestamp and status along with
                    //main json so parsing occurs still at status 200
                    let jsonString = err.error.text;
                    jsonString = jsonString.substr(
                        0,
                        jsonString.indexOf('{"timestamp"')
                    );
                }
            }
        );
    }

    getNotificationCount(notification) {
        this.notification.isNotificationRead = false;
        this.customerService.getNotificationCount(notification).subscribe(
            (data) => {
                this.notificationCount = data.count;
                console.log("Count Notification", this.notificationCount);
            },
            (err: HttpErrorResponse) => {
                if (err.status === 200) {
                    //json circular break at server side always add
                    //extra information of timestamp and status along with
                    //main json so parsing occurs still at status 200
                    let jsonString = err.error.text;
                    jsonString = jsonString.substr(
                        0,
                        jsonString.indexOf('{"timestamp"')
                    );
                }
            }
        );
    }

    readNotification() {
        this.customerService
            .readNotification(this.notification.toUserId)
            .subscribe(
                (data) => {
                    if (data.message == "ok") {
                        setTimeout(() => {
                            this.getNotificationCount(this.notification);
                        }, 10000);
                    }
                    // this.notificationCount = data.data;
                },
                (err: HttpErrorResponse) => {
                    if (err.status === 200) {
                        //json circular break at server side always add
                        //extra information of timestamp and status along with
                        //main json so parsing occurs still at status 200
                        let jsonString = err.error.text;
                        jsonString = jsonString.substr(
                            0,
                            jsonString.indexOf('{"timestamp"')
                        );
                    }
                }
            );
    }

    getStyle(index: number): any {
        // Define your dynamic style logic here
        if (index < this.notificationCount) {
            return {
                color: "rgba(0, 0, 0, 1)",
            };
        }
    }
}
