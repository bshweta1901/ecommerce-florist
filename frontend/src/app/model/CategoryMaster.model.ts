import { CommonMaster } from "./CommonMaster.model";
import { DocumentMaster } from "./DocumentMaster.model";


export class CategoryMaster extends CommonMaster {
  public name: string;
  public description?: string;
  public code: string;
  public category_img?: DocumentMaster;
  public category_img_path?: string;
  public status: string;

  constructor(init?: Partial<CategoryMaster>) {
      super();
      Object.assign(this, init);
  }

  toJSON() {
      const { category_img_path, category_img,status, ...rest } = this;
      return rest;
  }
}
    
