import { Component } from "@angular/core";
import { AccessControlMaster } from "../model/AccessControlMaster.model";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { SaveNotification, User } from "../model/User.model";
import { Router } from "@angular/router";
import { AuthService } from "../service/auth.service";
import { SessionClient } from "../configuration/sessionclientstorage";
import { HttpErrorResponse } from "@angular/common/http";
import { AngularFireRemoteConfig } from "@angular/fire/compat/remote-config";
import { HeadCallsService } from "../service/HeadCalls.service";
import { SweetAlertService } from "../service/sweet-alert.service";

@Component({
    selector: "app-login",
    templateUrl: "./app.login.component.html",
})
export class AppLoginComponent {
    visible: boolean = true;
    changetype: boolean = true;
    newvisible: boolean = true;
    changenewtype: boolean = true;
    confirmvisible: boolean = true;
    changeconfirmtype: boolean = true;
    accessControlFilter: AccessControlMaster = new AccessControlMaster();
    accessList: AccessControlMaster[] = [];
    accessControlMasterMap: { [moduleCode: string]: AccessControlMaster } = {};
    myForm: UntypedFormGroup;
    addOTPForm: UntypedFormGroup;
    user: User = new User();
    userOtp: User = new User();
    saveNotificationObj: SaveNotification = new SaveNotification();
    loginErrorMsg: string = "";
    imageUrl: string;
    getLoginImage: any;
    refreshAuthToken: string;
    getRemoteConfigResponse: any;
    remoteConfigData!: any;
    showLoginForm: boolean = true;
    showOTPForm: boolean = false;
    errorLoginString: string;
    accessControlMasterList: any[] = [];
    msg: string;
    savedEmail: any;
    rememberMe: boolean = false;
    constructor(
        private router: Router,
        private authService: AuthService,
        private sessionClient: SessionClient,
        public headCallsService: HeadCallsService,
        private remoteConfig: AngularFireRemoteConfig,
        private sweetAlertService: SweetAlertService
    ) {}

    ngOnInit(): void {
        this.myForm = new UntypedFormGroup({
            username: new UntypedFormControl("", Validators.required),
            password: new UntypedFormControl("", [Validators.required]),
        });
        this.savedEmail = localStorage.getItem("savedEmail");

        if (this.savedEmail) {
            try {
                const parsedEmail = JSON.parse(this.savedEmail); // Parse the JSON string
                this.user = parsedEmail.user; // Assign the parsed object to `this.user`
                this.rememberMe = true;
                console.log(parsedEmail, "savedEmail"); // Log the parsed object
                console.log(this.user, "savedEmail");
                this.router.navigate(["/panel/product-list"]);
            } catch (error) {
                console.error(
                    "Failed to parse savedEmail from localStorage",
                    error
                );
                this.user = null; // Handle invalid or corrupted JSON gracefully
            }
        }

        this.addOTPForm = new UntypedFormGroup({
            otp: new UntypedFormControl("", [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
            ]),
        });
        //console.log(this.headCallsService.getHeadCalls(), "head ");

        this.getRemoteConfigResponse = this.authService.geRemoteConfigData();
    }
    // checkRemember(event) {
    //     console.log(event.checked, "evemt");
    //     if (event.checked.length > 0) {
    //         this.rememberMe = true;
    //     } else if (event.checked.length == 0) {
    //         this.rememberMe = false;
    //     }
    // }

    checkRemember(event: any) {
        this.rememberMe = event.checked;
        console.log("Remember Me:", this.rememberMe);
    }

    viewpass() {
        this.visible = !this.visible;
        this.changetype = !this.changetype;
    }

    viewnewpass() {
        this.newvisible = !this.newvisible;
        this.changenewtype = !this.changenewtype;
    }

    keyPressForNum(event: any) {
        var inp = String.fromCharCode(event.keyCode);

        if (/[0-9]/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    viewconfirmpass() {
        this.confirmvisible = !this.confirmvisible;
        this.changeconfirmtype = !this.changeconfirmtype;
    }

    // validate user

    saveNotification() {
        this.authService.saveNotification(this.saveNotificationObj).subscribe(
            (data) => {
                // this.sweetAlertService.successAlert("Log in Successfully!");
            },
            (err) => {
                // this.sweetAlertService.errorAlert("Something Went Wrong");
            }
        );
    }

    validateUser(): void {
        let validationCheck = false;

        if (
            this.user.username === null ||
            this.user.username === undefined ||
            this.user.username === ""
        ) {
            validationCheck = true;
            this.loginErrorMsg = "Please enter email address";
        }

        if (!this.isValidEmail(this.user.username)) {
            validationCheck = true;
            this.loginErrorMsg = "Please enter valid email address!";
        }

        if (
            this.user.password === null ||
            this.user.password === undefined ||
            this.user.password === ""
        ) {
            validationCheck = true;
            this.loginErrorMsg = "Please Enter Password";
        }
        if (
            (this.user.username === null ||
                this.user.username === undefined ||
                this.user.username === "") &&
            (this.user.password === null ||
                this.user.password === undefined ||
                this.user.password === "")
        ) {
            validationCheck = true;
            this.loginErrorMsg = "Please Enter email and Password";
        }

        if (validationCheck) {
            this.sweetAlertService.errorAlert(this.loginErrorMsg);
        } else {
            // this.getUserByUsername(this.user);

            this.userOtp.username = this.user.username;
            this.userOtp.roles = this.user.roles;
            this.user.is_admin = true;
            this.authService.attemptAuth(this.user).subscribe(
                (data) => {
                     
                    this.user = data.tokens;
                    if (this.rememberMe) {
                        localStorage.setItem(
                            "savedEmail",
                            JSON.stringify(this.user)
                        );
                    } else {
                        localStorage.removeItem("savedEmail");
                    }
                     
                    // console.log(this.user,"this.user")
                    // this.sessionClient.saveToken(data.token)
                    this.sessionClient.saveToken(this.user.access_token);
                    const encodedToken = btoa(this.user.refresh_token);
                    //console.log(encodedToken,"encodedToken");
                    this.sessionClient.saveRefreshToken(encodedToken);
                    //console.log("Token->" + this.user.accessToken);
                    this.refreshAuthToken = this.user.refresh_token;
                    //console.log(btoa(this.refreshAuthToken));
                    this.getUserById(this.user);
                    this.saveNotification();

                    // this.showOTPForm = true;
                    // this.sendOTP();

                    //this.getUserById(this.user);
                },
                (error: HttpErrorResponse) => {
                    this.sessionClient.signOut();
                    if (error.status === 401) {
                        this.loginErrorMsg = error.error.message;
                        //console.log("ERROR LOGIN " + error.error.message);
                    } else if (error.status === 403) {
                        this.getUserById(this.user);
                    } else {
                        this.loginErrorMsg = "Invalid Username or Password";
                        //console.log("ERROR LOGIN " + error.message);
                    }

                    this.sweetAlertService.errorAlert(this.loginErrorMsg);

                    //  console.log("user not found");
                    //this.isLoginError=true;
                }
            );

            //this.user.roles = ["ROLE_ADMIN","FACTORY_ADMIN"];
            //console.log(this.user, "validateUser call");

            //this.userOtp.username = this.user.username;
            //this.userOtp.roles = ["ROLE_ADMIN","FACTORY_ADMIN"];
            // console.log(this.showOTPForm,"before showOTPForm")
            /*this.authService.attemptAuth(this.user).subscribe(
        (data) => {
          this.user=data.data;
        
          // console.log(this.showOTPForm,"after showOTPForm")
          //console.log(this.user,"this.user")
         
          this.sessionClient.saveToken(this.user.accessToken);
          const encodedToken = btoa(this.user.refreshToken);
          //console.log(encodedToken,"encodedToken");
          this.sessionClient.saveRefreshToken(encodedToken);
          //console.log("Token->" + this.user.accessToken);
          this.refreshAuthToken = this.user.refreshToken;
          //console.log(btoa(this.refreshAuthToken));
          
          this.showOTPForm = true;
          this.sendOTP();
          // this.getUserById(this.user);

          //console.log("validateUser inner");
        },
        (error: HttpErrorResponse) => {
          this.sessionClient.signOut();
          if (error.status === 401) {
            this.loginErrorMsg = "Please Enter Valid Username & Password.";
            //console.log("ERROR LOGIN " + error.error.message);
          } else if (error.status === 403) {
            this.getUserById(this.user);
          } else {
            this.loginErrorMsg = "Invalid Username or Password";
            //console.log("ERROR LOGIN " + error.message);
          }

          this.sweetAlertService.errorAlert(
            this.loginErrorMsg
          );
        }
      );*/
        }
    }

    getUserByUsername(user: User): void {
        this.authService.getUserByUsername(user).subscribe(
            (data) => {
                //console.log(this.user.roles);
                this.user.roles = [];

                this.user.roles.push(data.data.roles[0].code);
                //console.log(this.user,'user')
                this.userOtp.username = this.user.username;
                this.userOtp.roles = this.user.roles;
                this.user.isAdminLogin = true;
                this.authService.attemptAuth(this.user).subscribe(
                    (data) => {
                        this.user = data.data;
                         
                        // console.log(this.user,"this.user")
                        // this.sessionClient.saveToken(data.token)
                        this.sessionClient.saveToken(this.user.access_token);
                        const encodedToken = btoa(this.user.refresh_token);
                        //console.log(encodedToken,"encodedToken");
                        this.sessionClient.saveRefreshToken(encodedToken);
                        //console.log("Token->" + this.user.accessToken);
                        this.refreshAuthToken = this.user.refresh_token;
                        //console.log(btoa(this.refreshAuthToken));
                        this.getUserById(this.user);

                        // this.showOTPForm = true;
                        // this.sendOTP();

                        //this.getUserById(this.user);
                    },
                    (error: HttpErrorResponse) => {
                        this.sessionClient.signOut();
                        if (error.status === 401) {
                            this.loginErrorMsg = error.error.message;
                            //console.log("ERROR LOGIN " + error.error.message);
                        } else if (error.status === 403) {
                            this.getUserById(this.user);
                        } else {
                            this.loginErrorMsg = "Invalid Username or Password";
                            //console.log("ERROR LOGIN " + error.message);
                        }

                        this.sweetAlertService.errorAlert(this.loginErrorMsg);

                        //  console.log("user not found");
                        //this.isLoginError=true;
                    }
                );
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
                    this.user = JSON.parse(jsonString);
                    this.authService.setUserSession(this.user);
                } else if (err.status === 400) {
                    //console.log(err.error.error.message,'msg');
                    let jsonString = err;
                    this.msg = jsonString.error.error.message;
                    this.sweetAlertService.errorAlert(this.msg);
                }
            }
        );
    }

    validatePwd(): void {
        let validationCheckReset = false;
        //console.log(this.user, "reset form");
        if (
            this.user.resetEmail === null ||
            this.user.resetEmail === undefined ||
            this.user.resetEmail === ""
        ) {
            validationCheckReset = true;
            this.loginErrorMsg = "Please Enter Email";
        }

        if (!this.isValidEmail(this.user.resetEmail)) {
            // If the entered email is not valid, handle the error (e.g., display a message to the user)
            //console.log('Invalid email address');
            validationCheckReset = true;
            this.loginErrorMsg = "Please enter valid email address!";
        }

        if (this.user.newPassword != this.user.confirmNewPassword) {
            validationCheckReset = true;
            this.loginErrorMsg =
                "New password and confirm password should be same!";
        }

        if (
            this.user.newPassword === null ||
            this.user.newPassword === undefined ||
            this.user.newPassword === ""
        ) {
            validationCheckReset = true;
            this.loginErrorMsg = "Please Enter New Password";
        }
        if (
            this.user.confirmNewPassword === null ||
            this.user.confirmNewPassword === undefined ||
            this.user.confirmNewPassword === ""
        ) {
            validationCheckReset = true;
            this.loginErrorMsg = "Please Enter Confirm Password";
        }
        if (
            (this.user.newPassword === null ||
                this.user.newPassword === undefined ||
                this.user.newPassword === "") &&
            (this.user.confirmNewPassword === null ||
                this.user.confirmNewPassword === undefined ||
                this.user.confirmNewPassword === "")
        ) {
            validationCheckReset = true;
            this.loginErrorMsg = "Please Enter all details";
        }

        if (validationCheckReset) {
            this.sweetAlertService.errorAlert(this.loginErrorMsg);
        } else {
            //called api
        }
    }

    private isValidEmail(email: string): boolean {
        // Regular expression to validate email format
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getUserById(user: User): void {
        this.authService.getUserDetails(user).subscribe(
            (data) => {
                console.log(data, "data");
                this.authService.setUserSession(data);
                this.redirection();
                this.remoteConfig.fetchAndActivate().then(async () => {
                    const jsonDataString = (
                        await this.remoteConfig.getValue("constants")
                    ).asString();

                    this.remoteConfigData = JSON.parse(jsonDataString);
                    //console.log(this.remoteConfigData,"this.remoteConfigData");
                    this.authService.setRemoteConfigData(this.remoteConfigData);

                    // if(data?.data?.roles.length > 0 && data?.data?.roles[0].id!==null && data?.data?.roles[0].id!==undefined){
                    //   this.getAccessControlListByRole(data?.data?.roles[0].id);
                    // }

                    if (
                        data.data.accessControlMasterList !== null &&
                        data.data.accessControlMasterList !== undefined &&
                        data.data.accessControlMasterList.length > 0
                    ) {
                        console.log(data, "dataads");
                        this.authService.setAccessControlData(
                            data.data.accessControlMasterList
                        );
                        this.redirection();
                    }
                    // this.getAccessControlListByUser();
                    // this.redirection();
                });
                // this.getaccessControlList();
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
                    this.user = JSON.parse(jsonString);
                    this.authService.setUserSession(this.user);
                } else if (err.status === 400) {
                    //console.log(err.error.error.message,'msg');
                    let jsonString = err;
                    this.msg = jsonString.error.error.message;
                    this.sweetAlertService.errorAlert(this.msg);
                }
            }
        );
    }

    redirection() {
        this.router.navigateByUrl("/panel/product-list");

        // this.accessControlMasterMap = this.authService.getAccessControlMapData();
        // console.log(this.accessControlMasterMap,"accessControlMasterMap");
        // if(this.accessControlMasterMap['all'] !== null && this.accessControlMasterMap['all'] !== undefined &&
        // this.accessControlMasterMap['all'].readAccess === true){
        //   this.router.navigateByUrl('/panel/dashboard');
        // }
        // else if(this.accessControlMasterMap['overview'] !== null && this.accessControlMasterMap['overview'] !== undefined &&
        //   this.accessControlMasterMap['overview'].readAccess === true){
        //     this.router.navigateByUrl('/panel/dashboard');
        //   }else if(this.accessControlMasterMap['carcass-chiller'] !== null && this.accessControlMasterMap['carcass-chiller'] !== undefined &&
        // this.accessControlMasterMap['carcass-chiller'].readAccess === true){
        //   this.router.navigateByUrl('/panel/carcass-chiller-mgnt');
        // }else if(this.accessControlMasterMap['debone'] !== null && this.accessControlMasterMap['debone'] !== undefined &&
        // this.accessControlMasterMap['debone'].readAccess === true){
        //   this.router.navigateByUrl('/panel/debone-list');
        // }
        // else if(this.accessControlMasterMap['plate-freezer'] !== null && this.accessControlMasterMap['plate-freezer'] !== undefined &&
        // this.accessControlMasterMap['plate-freezer'].readAccess === true){
        //   this.router.navigateByUrl('/panel/plate-freezer-mgnt');
        // }else if(this.accessControlMasterMap['blast-freezer'] !== null && this.accessControlMasterMap['blast-freezer'] !== undefined &&
        // this.accessControlMasterMap['blast-freezer'].readAccess === true){
        //   this.router.navigateByUrl('/panel/blast-freezer-mgnt');
        // }else if(this.accessControlMasterMap['sampling'] !== null && this.accessControlMasterMap['sampling'] !== undefined &&
        // this.accessControlMasterMap['sampling'].readAccess === true){
        //   this.router.navigateByUrl('/panel/sampling-fresh-process');
        // }else if(this.accessControlMasterMap['staff'] !== null && this.accessControlMasterMap['staff'] !== undefined &&
        // this.accessControlMasterMap['staff'].readAccess === true){
        //   this.router.navigateByUrl('/panel/staff-list');
        // }else if(this.accessControlMasterMap['chiller-master'] !== null && this.accessControlMasterMap['chiller-master'] !== undefined &&
        // this.accessControlMasterMap['chiller-master'].readAccess === true){
        //   this.router.navigateByUrl('/panel/chiller-list');
        // }else if(this.accessControlMasterMap['freezer-master'] !== null && this.accessControlMasterMap['freezer-master'] !== undefined &&
        // this.accessControlMasterMap['freezer-master'].readAccess === true){
        //   this.router.navigateByUrl('/panel/freezer-master');
        // }else if(this.accessControlMasterMap['sampling-master'] !== null && this.accessControlMasterMap['sampling-master'] !== undefined &&
        // this.accessControlMasterMap['sampling-master'].readAccess === true){
        //   this.router.navigateByUrl('/panel/sampling-fresh');
        // }
        // else if(this.accessControlMasterMap['product-master'] !== null && this.accessControlMasterMap['product-master'] !== undefined &&
        // this.accessControlMasterMap['product-master'].readAccess === true){
        //   this.router.navigateByUrl('/panel/product');
        // }else if(this.accessControlMasterMap['factory-master'] !== null && this.accessControlMasterMap['factory-master'] !== undefined &&
        // this.accessControlMasterMap['factory-master'].readAccess === true){
        //   this.router.navigateByUrl('/panel/factory-list');
        // }else if(this.accessControlMasterMap['unit-rate'] !== null && this.accessControlMasterMap['unit-rate'] !== undefined &&
        // this.accessControlMasterMap['unit-rate'].readAccess === true){
        //   this.router.navigateByUrl('/panel/unit-rate-master');
        // }
    }

    // redirection() {
    //   setTimeout(() => {
    //     // window.location.reload();
    //     this.router.navigateByUrl("/panel/dashboard");

    //   }, 500);
    // }

    toggleForms() {
        this.showLoginForm = !this.showLoginForm;
    }

    sendOTP() {
        //console.log(this.userOtp, 'send otp details');
        // this.user.roles=["ROLE_CUSTOMER"]
        this.authService.sendOTP(this.userOtp).subscribe(
            (data) => {
                // this.countdown.begin();
                //  if(data.data.otp!=this.user.otp){
                //   this.errorLoginString="Please enter valid OTP"
                //  }
                //  else{
                //   this.errorLoginString=""
                //  }
                // console.log(data, "data");
            },
            (err: HttpErrorResponse) => {
                if (err.status === 200) {
                    let jsonString = err.error.text;
                    jsonString = jsonString.substr(
                        0,
                        jsonString.indexOf('{"timestamp"')
                    );
                }
            }
        );
    }

    verifyOTP() {
        //console.log(this.user, "user");
        this.authService.verifyOTP(this.userOtp).subscribe(
            (data) => {
                this.errorLoginString = "";
                this.getUserById(this.user);
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
                if (err.status === 400) {
                    //console.log(err,"err");
                    let jsonString = "";
                    if (err.error.error.otp) {
                        jsonString = err.error.error.otp;
                    } else {
                        jsonString = err.error.error.message;
                    }

                    //console.log(jsonString,"jsonString")

                    this.errorLoginString = jsonString;
                    // this.sweetAlertService.errorAlert(
                    //   this.errorLoginString
                    // );
                }
            }
        );
    }

    getAccessControlListByRole(roleId: string): void {
        //console.log(roleId,'role');
        this.authService.getAccessControlListByRole(roleId).subscribe(
            (data) => {
                this.accessControlMasterList = data.data;
                //console.log(this.accessControlMasterList);
                if (
                    this.accessControlMasterList !== null &&
                    this.accessControlMasterList !== undefined &&
                    this.accessControlMasterList.length > 0
                ) {
                    this.authService.setAccessControlData(
                        this.accessControlMasterList
                    );
                    this.redirection();
                }

                // this.getaccessControlList();
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

    getAccessControlListByUser(): void {
        //console.log(roleId,'role');
        this.authService.getAccessControlListByUser().subscribe(
            (data) => {
                this.accessControlMasterList = data.data;
                //console.log(this.accessControlMasterList);
                if (
                    this.accessControlMasterList !== null &&
                    this.accessControlMasterList !== undefined &&
                    this.accessControlMasterList.length > 0
                ) {
                    this.authService.setAccessControlData(
                        this.accessControlMasterList
                    );
                    this.redirection();
                }
            },
            (err: HttpErrorResponse) => {
                if (err.status === 200) {
                    let jsonString = err.error.text;
                    jsonString = jsonString.substr(
                        0,
                        jsonString.indexOf('{"timestamp"')
                    );
                }
            }
        );
    }
}
