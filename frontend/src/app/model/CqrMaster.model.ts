import { Factory } from "./Factory.model";
import { PredefinedMaster } from "./PredefinedMaster.model";
import { ProductMaster } from "./ProductMaster.model";

export class CqrMaster{
    public pageNumber:number;
    public pageSize:number;
    public factoryMaster: Factory;
    public id;
    public filterDate:any
    public searchBy:string;
    public productType:PredefinedMaster;
    public productMaster:ProductMaster;
    public cartonSampled;
    public pktSampled;
    public remarks;
    public uuid;
    public productCode:any;
    public searchValue:string;

}