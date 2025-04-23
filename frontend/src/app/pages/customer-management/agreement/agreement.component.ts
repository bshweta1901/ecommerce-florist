import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Contract } from "src/app/model/Contract.model";
import { CustomerService } from "src/app/service/customerservice";
import SignaturePad from "signature_pad";
import { SweetAlertService } from "src/app/service/sweet-alert.service";

@Component({
    selector: "app-agreement",
    templateUrl: "./agreement.component.html",
    styleUrls: ["./agreement.component.scss"],
})
export class AgreementComponent implements OnInit {
    srcView: string;
    contract: Contract = {} as Contract;
    @ViewChild("canvas", { static: true }) canvas!: ElementRef;
    sig!: SignaturePad;
    isShowSignature: boolean;

    constructor(
        private customerService: CustomerService,
        private activatedRoute: ActivatedRoute,
        private sweetAlertService: SweetAlertService
    ) {}

    ngAfterViewInit() {
        this.sig = new SignaturePad(this.canvas.nativeElement);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((data: any) => {
            this.contract.uuid = data.id;
            this.getCustomerContractById(this.contract.uuid);
        });
    }

    getCustomerContractById(contractId: string) {
        this.customerService.getCustomerContractById(contractId).subscribe(
            (data: any) => {
                this.contract = data;
                console.log(this.contract, "this.contract");
            },
            (err: any) => {
                console.error(err, "ERR");
            }
        );
    }

    clearSignature() {
        this.sig.clear();
    }

    submitSign() {
        let base64Data = this.sig.toDataURL("image/png");
        this.customerService
            .signAgreement(this.contract.uuid, base64Data)
            .subscribe(
                (data: any) => {
                    this.isShowSignature = false;
                    this.sweetAlertService.successAlert(
                        "Form submitted successfully!"
                    );
                },
                (err: any) => {
                    console.error(err, "ERR");
                }
            );
    }
}
