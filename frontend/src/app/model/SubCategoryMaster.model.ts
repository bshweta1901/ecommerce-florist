import { CategoryMaster } from "./CategoryMaster.model";
import { CommonMaster } from "./CommonMaster.model";


export class SubCategoryMaster extends CommonMaster{
        public name:string;
        public description:string;
        public code:string;
        public sub_category_img:Document;
        public category:CategoryMaster;
        public category_id:number;
        
        public sub_category_img_path :String;
        constructor(init?: Partial<SubCategoryMaster>) {
                super();
                Object.assign(this, init);
            }
          
            toJSON() {
                const { sub_category_img,sub_category_img_path, category,status, ...rest } = this;
                return rest;
            }
}