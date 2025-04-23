import { ChillerMaster } from "./ChillerMaster.model";
import { PredefinedMaster } from "./PredefinedMaster.model";

export class ChillerReadingMaster{
    public id:any;
    public readingTime:any;
    public temperatureSet:number;
    public humiditySet:any;
    public phSet:any;
    public takenBy:string;
    public pageNumber:number;
    public pageSize:number;
    public searchValue:string;
    public chillerMaster:ChillerMaster;
    public chillerDailyLog:ChillerMaster;
    public status;
    public chillerId;
    public hotDebone:string;
    public reportFor:string;
    public filterDate:any;
    public temperatureSetAt:string;
    public carcassNo:string;
    public postChillingWt:string;
    public originalWt:string;
    public ph:PredefinedMaster;
    public humidity:PredefinedMaster;
    public totalCarcassLoaded:string
}