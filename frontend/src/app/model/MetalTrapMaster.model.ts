import { Factory } from "./Factory.model";
import { PredefinedMaster } from "./PredefinedMaster.model";

export class MetalTrapMaster{
    public pageNumber:number;
    public pageSize:number;
    public factoryMaster: Factory;
    public id;
    public filterDate:any
    public dataFor:string;
    public sourceName:string;
    public percentage:number;
    public metals:PredefinedMaster[]=[];
    public productSku:string;
    public searchValue:string;
}