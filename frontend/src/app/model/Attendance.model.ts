import { User } from "./User.model";

export class Attendance{
   public id:number;
   public date:string;
   public time:string;
   public user:User;
   public pageNumber:number;
   public pageSize:number;
   public searchValue:string;
}