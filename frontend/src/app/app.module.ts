import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { DatePipe, HashLocationStrategy, LocationStrategy } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { AccordionModule } from "primeng/accordion";
import { AutoCompleteModule } from "primeng/autocomplete";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { BadgeModule } from "primeng/badge";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { CarouselModule } from "primeng/carousel";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { ChartModule } from "primeng/chart";
import { CheckboxModule } from "primeng/checkbox";
import { ChipModule } from "primeng/chip";
import { ChipsModule } from "primeng/chips";
import { CodeHighlighterModule } from "primeng/codehighlighter";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ColorPickerModule } from "primeng/colorpicker";
import { ContextMenuModule } from "primeng/contextmenu";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { DropdownModule } from "primeng/dropdown";
import { FieldsetModule } from "primeng/fieldset";
import { FileUploadModule } from "primeng/fileupload";
import { FullCalendarModule } from "@fullcalendar/angular";
import { GalleriaModule } from "primeng/galleria";
import { ImageModule } from "primeng/image";
import { InplaceModule } from "primeng/inplace";
import { InputNumberModule } from "primeng/inputnumber";
import { InputMaskModule } from "primeng/inputmask";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { KnobModule } from "primeng/knob";
import { LightboxModule } from "primeng/lightbox";
import { ListboxModule } from "primeng/listbox";
import { MegaMenuModule } from "primeng/megamenu";
import { MenuModule } from "primeng/menu";
import { MenubarModule } from "primeng/menubar";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MultiSelectModule } from "primeng/multiselect";
import { OrderListModule } from "primeng/orderlist";
import { OrganizationChartModule } from "primeng/organizationchart";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { PaginatorModule } from "primeng/paginator";
import { PanelModule } from "primeng/panel";
import { PanelMenuModule } from "primeng/panelmenu";
import { PasswordModule } from "primeng/password";
import { PickListModule } from "primeng/picklist";
import { ProgressBarModule } from "primeng/progressbar";
import { RadioButtonModule } from "primeng/radiobutton";
import { RatingModule } from "primeng/rating";
import { RippleModule } from "primeng/ripple";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { ScrollTopModule } from "primeng/scrolltop";
import { SelectButtonModule } from "primeng/selectbutton";
import { SidebarModule } from "primeng/sidebar";
import { SkeletonModule } from "primeng/skeleton";
import { SlideMenuModule } from "primeng/slidemenu";
import { SliderModule } from "primeng/slider";
import { SplitButtonModule } from "primeng/splitbutton";
import { SplitterModule } from "primeng/splitter";
import { StepsModule } from "primeng/steps";
import { TabMenuModule } from "primeng/tabmenu";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { TagModule } from "primeng/tag";
import { TerminalModule } from "primeng/terminal";
import { TieredMenuModule } from "primeng/tieredmenu";
import { TimelineModule } from "primeng/timeline";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { TreeModule } from "primeng/tree";
import { TreeTableModule } from "primeng/treetable";
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { AngularFireModule } from "@angular/fire/compat";
import {
    AngularFireRemoteConfigModule,
    DEFAULTS,
    SETTINGS,
} from "@angular/fire/compat/remote-config";
import { AppCodeModule } from "./blocks/app-code/app.code.component";
import { AppComponent } from "./app.component";
import { AppMainComponent } from "./app.main.component";
import { AppConfigComponent } from "./app.config.component";
import { AppMenuComponent } from "./app.menu.component";
import { AppMenuitemComponent } from "./app.menuitem.component";
import { AppRightPanelComponent } from "./app.rightpanel.component";
import { AppBreadcrumbComponent } from "./app.breadcrumb.component";
import { AppTopBarComponent } from "./app.topbar.component";
import { AppFooterComponent } from "./app.footer.component";
import { DashboardDemoComponent } from "./demo/view/dashboarddemo.component";
import { FormLayoutDemoComponent } from "./demo/view/formlayoutdemo.component";
import { FloatLabelDemoComponent } from "./demo/view/floatlabeldemo.component";
import { InvalidStateDemoComponent } from "./demo/view/invalidstatedemo.component";
import { InputDemoComponent } from "./demo/view/inputdemo.component";
import { ButtonDemoComponent } from "./demo/view/buttondemo.component";
import { TableDemoComponent } from "./demo/view/tabledemo.component";
import { ListDemoComponent } from "./demo/view/listdemo.component";
import { TreeDemoComponent } from "./demo/view/treedemo.component";
import { PanelsDemoComponent } from "./demo/view/panelsdemo.component";
import { OverlaysDemoComponent } from "./demo/view/overlaysdemo.component";
import { MediaDemoComponent } from "./demo/view/mediademo.component";
import { MenusComponent } from "./demo/view/menus/menus.component";
import { MessagesDemoComponent } from "./demo/view/messagesdemo.component";
import { MiscDemoComponent } from "./demo/view/miscdemo.component";
import { EmptyDemoComponent } from "./demo/view/emptydemo.component";
import { ChartsDemoComponent } from "./demo/view/chartsdemo.component";
import { FileDemoComponent } from "./demo/view/filedemo.component";
import { DocumentationComponent } from "./demo/view/documentation.component";
import { IconsComponent } from "./utilities/icons.component";
import { AppCrudComponent } from "./pages/app.crud.component";
import { AppCalendarComponent } from "./pages/app.calendar.component";
import { AppTimelineDemoComponent } from "./pages/app.timelinedemo.component";
import { AppInvoiceComponent } from "./pages/app.invoice.component";
import { AppHelpComponent } from "./pages/app.help.component";
import { AppNotfoundComponent } from "./pages/app.notfound.component";
import { AppErrorComponent } from "./pages/app.error.component";
import { AppAccessdeniedComponent } from "./pages/app.accessdenied.component";
import { AppLoginComponent } from "./pages/app.login.component";
import { BlockViewer } from "./blocks/blockviewer/blockviewer.component";
import { BlocksComponent } from "./blocks/blocks/blocks.component";

import { CountryService } from "./demo/service/countryservice";
import { CustomerService } from "./demo/service/customerservice";
import { EventService } from "./demo/service/eventservice";
import { IconService } from "./demo/service/iconservice";
import { NodeService } from "./demo/service/nodeservice";
import { PhotoService } from "./demo/service/photoservice";
import { ProductService } from "./demo/service/productservice";
import { ConfigService } from "./demo/service/app.config.service";

import { MenuService } from "./app.menu.service";
import { AppBreadcrumbService } from "./app.breadcrumb.service";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { environment } from "src/environments/environment";
import { HeadCallsService } from "./service/HeadCalls.service";
import { AuthService } from "./service/auth.service";
import { SessionClient } from "./configuration/sessionclientstorage";
import { HTTPStatus, Interceptor } from "./app.interceptor";
import { ProductManagementComponent } from "./pages/product-management/product-management.component";
import { NgCircleProgressModule } from "ng-circle-progress";
import { CustomValidationComponent } from "./pages/custom-validation/custom-validation.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { AgreementComponent } from "./pages/customer-management/agreement/agreement.component";
import { CommonModalModule } from "./pages/common-modal/common-modal.module";
import { CommonModalComponent } from "./pages/common-modal/common-modal.component";

FullCalendarModule.registerPlugins([
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
]);

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarGroupModule,
        AvatarModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        ChipModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        ColorPickerModule,
        CalendarModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        ImageModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        PdfViewerModule,
        TagModule,
        TerminalModule,
        TieredMenuModule,
        TimelineModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        CommonModalModule,
        AppCodeModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireRemoteConfigModule,
        NgCircleProgressModule.forRoot({
            radius: 30,
            space: -10,
            outerStrokeGradient: false,
            outerStrokeWidth: 6,
            outerStrokeColor: "#4882c2",
            outerStrokeGradientStopColor: "#53a9ff",
            innerStrokeColor: "#e7e8ea",
            innerStrokeWidth: 10,
            animateTitle: false,
            animationDuration: 1000,
            showUnits: true,
            showBackground: false,
            startFromZero: false,
            lazy: false,
            showSubtitle: false,
        }),
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppRightPanelComponent,
        AppBreadcrumbComponent,
        AppTopBarComponent,
        AppFooterComponent,
        DashboardDemoComponent,
        FormLayoutDemoComponent,
        FloatLabelDemoComponent,
        InvalidStateDemoComponent,
        InputDemoComponent,
        ButtonDemoComponent,
        TableDemoComponent,
        ListDemoComponent,
        TreeDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent,
        MediaDemoComponent,
        MenusComponent,
        MessagesDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        DocumentationComponent,
        IconsComponent,
        AgreementComponent,
        AppCrudComponent,
        AppCalendarComponent,
        AppTimelineDemoComponent,
        AppLoginComponent,
        AppInvoiceComponent,
        AppHelpComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        BlocksComponent,
        BlockViewer,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
        MenuService,
        AppBreadcrumbService,
        ConfigService,
        DatePipe,
        HeadCallsService,
        AuthService,
        SessionClient,
        HTTPStatus,
        { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    ],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
