import { ModuleMaster } from "./ModuleMaster.model";
import { Role } from "./Role.model";
import { User } from "./User.model";

export class AccessControlMaster {
  public roleId: number;
  public accessControlId: number;
  public id: number;
  public user: User;
  public createAccess: boolean;
  public readAccess: boolean;
  public updateAccess: boolean;
  public deleteAccess: boolean;
  public role: Role;
  public userId: number;
  public moduleName: string;
  public moduleMaster: ModuleMaster;
  public module;
  public pageNumber: number;
  public pageSize: number;
  public isDelete: string;
  public moduleCode: string;
}
