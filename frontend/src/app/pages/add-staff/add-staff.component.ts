import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Factory } from 'src/app/model/Factory.model';
import { Role } from 'src/app/model/Role.model';
import { StaffMaster } from 'src/app/model/StaffMaster.model';
import { FactoryService } from 'src/app/service/factory.service';
import { StaffService } from 'src/app/service/staff.service';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent implements OnInit {
  @Input() hideButton: boolean;
  @Input() eventData: StaffMaster;
  @Output() close = new EventEmitter<boolean>();
  @Output() saveEvents = new EventEmitter<any>();

  @ViewChild('calendar') private calendar: any;

  addStaffForm: FormGroup;
  staff: StaffMaster = new StaffMaster();
  roleList: any[] = [];
  factoryList: any[] = [];
  moduleList: any[] = [];
  isLoading = false;
  errorBean: any = {};
  msg: string;
  minDate: Date;
  rangeDates: Date[];

  constructor(
    private staffService: StaffService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    if (this.eventData) {
      this.staff = this.eventData;
    }

    this.getRoleList();
    this.initializeDates();
  }

  initializeForm(): void {
    this.addStaffForm = new FormGroup({
      fullName: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
      ]),
      phone: new FormControl(""),
      dob: new FormControl(""),
      doj: new FormControl(""),
      roles: new FormControl("", [Validators.required]),
    });
  }

  initializeDates(): void {
    const date: Date = undefined;

    if (!this.staff.dob) {
      this.staff.dob = date;
    } else {
      this.staff.dob = new Date(this.staff.dob);
    }

    if (!this.staff.doj) {
      this.staff.doj = date;
    } else {
      this.staff.doj = new Date(this.staff.doj);
    }

    this.minDate = new Date(this.staff.dob);
  }

  leadingSpaceValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && (value.trimLeft() !== value || value.trim() === '')) {
      return value.trimLeft() !== value ? { leadingSpace: true } : { onlySpaces: true };
    }
    return null;
  }

  keyPressForName(event: any): boolean {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z '.]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  errorShowphone(): void {
    if (this.staff.phone && this.staff.phone.toString().length !== 10) {
      this.errorBean.phone1 = true;
      this.errorBean.phone = false;
    } else {
      this.errorBean.phone1 = false;
    }
  }

  errorShowphone1(): void {
    if (this.staff.alternatePhone && this.staff.alternatePhone.toString().length !== 10) {
      this.errorBean.phone2 = true;
      this.errorBean.alternatePhone = false;
    } else {
      this.errorBean.phone2 = false;
    }
  }

  getRoleList(): void {
    this.staffService.getRoleList(new Role()).subscribe(
      (data) => {
        this.roleList = data.data || [];
        this.staff.selectedRoleValueList = [];
        this.staff.roles = [];
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          err.error.text.substr(0, err.error.text.indexOf('{"timestamp"'));
        }
      }
    );
  }

  saveStaff(): void {
    this.staff.roles = [];
    this.staff.roles.push(this.staff.selectedRole.code);
  
    this.staffService.saveStaff(this.staff.toJSON()).subscribe(  // <-- Notice toJSON() here
      (data) => {
        this.sweetAlertService.successAlert(
          "User has been added successfully"
        );
        this.saveEvents.emit();
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
        } else if (err.status === 400) {
          let jsonString = err;
          this.msg = jsonString.error.error.message;
          this.sweetAlertService.errorAlert(this.msg);
          this.saveEvents.emit();
        }
      }
    );
  }
  

  updateStaff(): void {
    this.staff.roles = [this.staff.selectedRole?.name];

    this.staffService.updateStaff(this.staff).subscribe(
      () => {
        this.sweetAlertService.successAlert("User Updated Successfully");
        this.saveEvents.emit();
      },
      (err: HttpErrorResponse) => this.handleError(err)
    );
  }

  handleError(err: HttpErrorResponse): void {
    if (err.status === 400) {
      this.msg = err.error.error.message;
      this.sweetAlertService.errorAlert(this.msg);
    }
    this.saveEvents.emit();
  }

  onSelect(): void {
    if (this.staff.rangeDates?.[1]) {
      this.calendar.overlayVisible = false;
    }
  }
}
