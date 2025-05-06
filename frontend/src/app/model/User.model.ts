import { PredefinedMaster } from "./PredefinedMaster.model";
import { Role } from "./Role.model";

export class User {
    public username: string;
    public id: number;
    public password: string;
    public otp: any;
    public code: string;
    public fullName: string;
    public uuid: string;
    public customException: any;
    public profileImageUrl: string;
    public phone: number;
    public email: string;
    public address: string;
    public status: PredefinedMaster;
    public isDeactive: string;
    public pageNumber: number;
    public currentPassword: string;
    public pageSize: number;
    public role: Role;
    public roleName: string;
    public newPassword: string;
    public confirmNewPassword: string;
    public roles: any[];
    public roleList: any[];
    public access_token: string;
    public refresh_token: string;
    public isAdminLogin: boolean;
    public searchValue: string;
    public selectedRoleValueList: any[];
    public resetEmail: string;
    public is_admin: boolean;
    public search_by: string;
    public first_name?: string;
}

export class SaveNotification {
    user_uuid: string;
    device_type: string;
    firebase_token: string;
    device_id: string;
}
