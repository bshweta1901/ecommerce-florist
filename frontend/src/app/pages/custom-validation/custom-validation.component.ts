import { Component, OnInit,Input } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { HeadCallsService } from 'src/app/service/HeadCalls.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-custom-validation',
  templateUrl: './custom-validation.component.html',
  styleUrls: ['./custom-validation.component.scss']
})
export class CustomValidationComponent implements OnInit {
  @Input() control: UntypedFormControl;
  @Input() label: string;
  getHeadCallsResponse:any;
  getRemoteConfigResponse:any;
  constructor(public HeadCallService:HeadCallsService,private authService:AuthService) { }

  ngOnInit(): void {
    // this.getHeadCalls();
    this.getRemoteConfigResponse = this.authService.geRemoteConfigData();
  }

  // getHeadCalls(){
  //   const getJsonDataValue= localStorage.getItem("headCallsResponse");
  //              this.getHeadCallsResponse = JSON.parse(getJsonDataValue);
  //              console.log(this.getHeadCallsResponse,"getHeadCallsResponsesad");
  // }
  get errorMessage() {
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      // minlength: `${this.label} must be at least ${this.control?.errors?.minlength?.requiredLength} characters long.`,
      //   maxlength: `${this.label} must not be more than ${this.control?.errors?.maxlength?.requiredLength} characters long.`,
      
      const messages = {
        required: `${this.label} is required`,
       // minlength: this.getRemoteConfigResponse?.Error_message?.MinLength,
       // maxlength: this.getRemoteConfigResponse?.Error_message?.MaxLength,
        minlength: `${this.label} must be at least ${this.control?.errors?.minlength?.requiredLength} characters long.`,
        maxlength: `${this.label} must not be more than ${this.control?.errors?.maxlength?.requiredLength} characters long.`,
        email: `${this.label} is invalid.`,
        pattern: `Invalid ${this.label}.`

      };

      const errorKey = Object.keys(this.control.errors).find((key) => this.control.errors[key]);

      return messages[errorKey];
    }

    return null;
  }
}
