import { Factory } from "./Factory.model";
import { GiveAwayMaster } from "./GiveAwayMaster.model";
import { PredefinedMaster } from "./PredefinedMaster.model";

export class ProductMaster{
    public id:number;
    public uuid:string;
    public productName:string;
    public productSKU:string;
    public lotNo:string;
    public description:string;
    public fatPercent:number;
    public brand: PredefinedMaster;
    public weight:PredefinedMaster;
    public commodity:PredefinedMaster;
    public itemType:PredefinedMaster;
    public freezerTypes:PredefinedMaster;
    public pageNumber:number;
    public pageSize:number;
    public searchValue;
    public brandName;
    public isAdmin:boolean;
    public productCode:string;
    public standardWeight:GiveAwayMaster;
    public country:PredefinedMaster;
    public isDeactivate:any;
    public factoryMaster:Factory;
}