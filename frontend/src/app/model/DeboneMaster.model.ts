import { Factory } from "./Factory.model";

export class DeboneMaster{
    public pageNumber:number;
    public pageSize:number;
    public searchValue:string;
    public filterDate:any;
    public factory:any[];
    public factoryMaster: Factory;
    public factoryId;
    public chillerDailyLogList:any[]=[];
    public id;
    public totalCarcassLoaded;
    public chillerName;
    public loadCloseDateTime;
    public remarks;
    public status;
    public isHighlight:boolean;
    public reportFor:string;
    public deboneEndDateTime:Date;
    public deboneStartDateTime:Date;
    public unloadedCarcass:Date;
    public uuid:string;
    public logDates:any;
}