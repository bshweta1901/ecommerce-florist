
import { PredefinedMaster } from "./PredefinedMaster.model";
import { CategoryMaster } from "./CategoryMaster.model";
import { SubCategoryMaster } from "./SubCategoryMaster.model";
import { CommonMaster } from "./CommonMaster.model";

export class ProductMaster extends CommonMaster{
    public id:number;
    public name:string;
    public sku:string;
    public description:string;
    public short_description:string;
    public price:number;
    public offer_price:number;
    public product_status:PredefinedMaster;
    public product_status_id:number;
    public category:CategoryMaster;
    public category_id:number;
    public sub_category:SubCategoryMaster;
    public sub_category_id:number;
    public is_add_on:Boolean=false;
    public product_images: any[]; 
    public product_status_name: any; 
    public is_default_img_path:any;
    public default_image_id:any;

    constructor(init?: Partial<ProductMaster>) {
        super();
        Object.assign(this, init);
    }
  
    toJSON() {
        const { sub_category, product_images,is_default_img_path,category,status,product_status_name,product_status, ...rest } = this;
        return rest;
    }
}