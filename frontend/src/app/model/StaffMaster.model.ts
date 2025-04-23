
export class StaffMaster{
    public id:number;
    public firstName:string;
    public lastName:string;
    public searchBy:string;
    public pageNumber:number;
    public pageSize:number;
    // public roleId;
    // public factoryId;
    // public isDeactivate;
    public searchValue:string;
    public email:string;
    public phone:number;
    public selectedRoleValueList:any[];
    public roles:any[];
    public roleList:any[];
    public factory:any[];
    public selectedFactoryValueList:any[];
    public rangeDates:Date[];
    public alternatePhone:number;
    public dob;
    public doj;
    public factoryUserList:any[]=[];
    public selectedRole;
    public staffMasterList:any[]=[];
    public factoryId:number;
    public adminLogin:boolean;
    public accessControlMasterList:any[]=[];
    public selectedAccessControlList:any[];
}