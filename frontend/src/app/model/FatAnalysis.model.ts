import { Factory } from "./Factory.model";
import { PredefinedMaster } from "./PredefinedMaster.model";
import { ProductMaster } from "./ProductMaster.model";

export class FatAnalysis{
    public pageNumber:number;
    public pageSize:number;
    public factoryMaster: Factory;
    public id;
    public filterDate:any
    public uuid;
    public searchValue:string;
    public searchBy:string;
    public productType:PredefinedMaster;
    // public productCode:PredefinedMaster;
    public productMaster:ProductMaster;
    public cartonSampled;
    public pktSampled;
    public remarks;
    public isHighlightFat:boolean;
    public productCode:any;
}