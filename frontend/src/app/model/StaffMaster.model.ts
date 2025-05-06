
export class StaffMaster{
    public id:number;
    public full_name:string;
    public search_by:string;
    public page:number;
    public per_page:number;
    public searchValue:string;
    public email:string;
    public phone:number;
    public selectedRoleValueList:any[];
    public roles:any[];
    public roleList:any[];
    public rangeDates:Date[];
    public alternatePhone:number;
    public dob;
    public doj;
    public selectedRole;
    public adminLogin:boolean;
    constructor(init?: Partial<StaffMaster>) {
        Object.assign(this, init);
      }
    
      toJSON() {
        const { selectedRoleValueList, selectedRole, doj, ...rest } = this;
    
        if (this.dob instanceof Date) {
            rest.dob = this.dob.toISOString().split('T')[0]; // Convert Date object to 'YYYY-MM-DD'
        } else if (typeof this.dob === 'string') {
            rest.dob = this.dob.split('T')[0]; // In case it's already a string
        }
    
        return rest;
    }
    
}