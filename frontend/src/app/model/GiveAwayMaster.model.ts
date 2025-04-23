import { Factory } from "./Factory.model";
import { PredefinedMaster } from "./PredefinedMaster.model";

export class GiveAwayMaster{
    public pageNumber:number;
    public pageSize:number;
    public factoryMaster: Factory;
    public id;
    public filterDate:any;
    public uuid:string;
    public productWeight:PredefinedMaster;
    public remarks:string;
    public allowedGiveAway:string;
    public searchBy:string;
    public searchValue:string;
    public standardWeight:PredefinedMaster;

}