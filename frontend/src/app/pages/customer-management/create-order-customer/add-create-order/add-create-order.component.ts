import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Contract, ContractItem } from "src/app/model/Contract.model";
import { FactoryService } from "src/app/service/factory.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";

@Component({
    selector: "app-add-create-order",
    templateUrl: "./add-create-order.component.html",
    styleUrls: ["./add-create-order.component.scss"],
})
export class AddCreateOrderComponent implements OnInit {
    // addFactoryForm: FormGroup;
    rackList: any[];
    trolleyList: any[];
    @Output() close = new EventEmitter<boolean>();
    @Input() hideButton: boolean;
    @Input() contractItem: ContractItem = {} as ContractItem;
    isLoading: boolean = false;
    errorBean: any = {};
    @Output() saveEvents: EventEmitter<any> = new EventEmitter();
    msg: string;
    sparePartTemp:string;
    maintanceCycleName:string;
    constructor(
        public factoryService: FactoryService,
        private sweetAlertService: SweetAlertService
    ) {}

    ngOnInit(): void {
        // alert(this.contractItem)
       if(this.contractItem!=null && this.contractItem!=undefined){
        this.contractItem = this.contractItem;
        console.log(this.contractItem,"this.contractItemthis.contractItemadss")
       }
       else{
        this.contractItem = {} as ContractItem;
       }
        
       this.sparePartTemp = this.contractItem?.spare_part[0]?.spare_part_name;
       this.maintanceCycleName = this.contractItem?.maintenance_cycle?.name
        console.log("contractItemasdasd", this.contractItem);
        console.log(this.sparePartTemp,"sparePartTemp")
        console.log(this.maintanceCycleName,"maintanceCycleName")
        // this.addFactoryForm = new FormGroup({
        //     location: new FormControl("", [
        //         Validators.required,
        //         this.leadingSpaceValidator,
        //         Validators.maxLength(500),
        //     ]),
        //     factoryName: new FormControl("", [
        //         Validators.required,
        //         this.leadingSpaceValidator,
        //         Validators.maxLength(500),
        //     ]),
        //     code: new FormControl("", [
        //         Validators.required,
        //         this.leadingSpaceValidator,
        //         Validators.maxLength(500),
        //     ]),
        // });
    }

    leadingSpaceValidator(control) {
        const value = control.value;
        if (value && (value.trimLeft() !== value || value.trim() === "")) {
            if (value.trimLeft() !== value) {
                return { leadingSpace: true };
            } else {
                return { onlySpaces: true };
            }
        }
        return null;
    }

    keyPressForAlphaNum(event: any) {
        var inp = String.fromCharCode(event.keyCode);

        if (/[a-zA-Z 0-9'.]/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
}
