import { Factory } from "./Factory.model";
import { PredefinedMaster } from "./PredefinedMaster.model";
import { ProductMaster } from "./ProductMaster.model";

export class DqrMaster{
    public pageNumber:number;
    public pageSize:number;
    public factoryMaster: Factory;
    public id;
    public filterDate:any;
    public srNO:number;
    public prodCOde:string;
    public produType:string;
    public carbon:string;
    public packTreshold:string;
    public remark:string;
    
    public searchBy:string;
    public productType:ProductMaster;
    public productMaster:ProductMaster;
    public cartonSampled;
    public pktSampled;
    public remarks;
    public uuid;
    public productCode:any;
    public searchValue:string;
    public brandName:string;
    public dqrMaster:Date;
    public fromDate:Date;
    public toDate:Date;
    public factoryId:number;
    public overviewFor:string;


}