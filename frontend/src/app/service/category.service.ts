import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { SessionClient } from "../configuration/sessionclientstorage";
import { CategoryMaster } from "../model/CategoryMaster.model";  // Assuming you have a CategoryMaster model
import { SubCategoryMaster } from "../model/SubCategoryMaster.model";

const httpOptions_FILE = {
  headers: new HttpHeaders({
    "Content-Type": "Application/json; charset=UTF-8",
  }),
  responseType: "blob" as "blob",
};

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(
    private http: HttpClient,
    private sessionClient: SessionClient
  ) {}
    category: CategoryMaster = new CategoryMaster();
    setCategorySession(product: CategoryMaster) {
        this.sessionClient.saveSession(
            "productdetailsSession",
            JSON.stringify(product)
        );
    }

    getCategorySession() {
        this.category = JSON.parse(
            localStorage.getItem("categorydetailsSession")
        );
        return this.category;
    }
    setSubCategorySession(product: SubCategoryMaster) {
      this.sessionClient.saveSession(
          "subcategorydetailsSession",
          JSON.stringify(product)
      );
  }

  getSubCategorySession() {
      this.category = JSON.parse(
          localStorage.getItem("subcategorydetailsSession")
      );
      return this.category;
  }
  // Method for saving category
  saveCategory(category: Partial<CategoryMaster>, uploadlImagePath: any): Observable<any> {
    // debugger;
    let formData: FormData = new FormData();
    // debugger;
    // let uploadImg = new Blob(uploadlImagePath)
    if(uploadlImagePath){
     
        formData.append("image", uploadlImagePath);
      
    }
    formData.append('data', JSON.stringify(category)); // No second argument like type: application/json
        
        return this.http.post(environment.apiUrl + "/category/", formData, {
            headers: {
                'Accept': 'application/json' // optional
                // Do NOT set 'Content-Type', browser will set it as multipart/form-data automatically
            }
        });
  }

  // Method for updating category
  updateCategory(category: Partial<CategoryMaster>,uploadlImagePath: any): Observable<any> {
     // debugger;
     let formData: FormData = new FormData();
     // debugger;
     // let uploadImg = new Blob(uploadlImagePath)
     if(uploadlImagePath){
      
         formData.append("image", uploadlImagePath);
       
     }
     formData.append('data', JSON.stringify(category)); // No second argument like type: application/json
         
         return this.http.put(environment.apiUrl + "/category/"+category.id, formData, {
             headers: {
                 'Accept': 'application/json' // optional
                 // Do NOT set 'Content-Type', browser will set it as multipart/form-data automatically
             }
         });
  }

  // Method for deleting category by id
  deleteCategoryById(category: CategoryMaster): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/category/delete/${category.id}`
    );
  }

  // Method for getting category list
  getCategoryList(category: CategoryMaster): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/category/list`,
      category
    );
  }

  // Method for getting category by UUID
  getCategoryById(category: CategoryMaster): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/category/${category.id}`
    );
  }


statusCategoryById(category: CategoryMaster): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + "/category/change-state/" + category.id
        );
    }
    
statusSubCategoryById(category: SubCategoryMaster): Observable<any> {
            return this.http.get<any>(
                environment.apiUrl + "/subcategory/change-state/" + category.id
            );
        }

          // Method for getting category by UUID
  getSubCategoryById(category: SubCategoryMaster): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/sub-category/${category.id}`
    );
  }
  // Method for saving subcategory
  saveSubCategory(category: Partial<SubCategoryMaster>, uploadlImagePath: any): Observable<any> {
    // debugger;
    let formData: FormData = new FormData();
    // debugger;
    // let uploadImg = new Blob(uploadlImagePath)
    if(uploadlImagePath){
     
        formData.append("image", uploadlImagePath);
      
    }
    formData.append('data', JSON.stringify(category)); // No second argument like type: application/json
        
        return this.http.post(environment.apiUrl + "/sub-category/", formData, {
            headers: {
                'Accept': 'application/json' // optional
                // Do NOT set 'Content-Type', browser will set it as multipart/form-data automatically
            }
        });
  }

  // Method for updating category
  updateSubCategory(category: Partial<SubCategoryMaster>,uploadlImagePath: any): Observable<any> {
     // debugger;
     let formData: FormData = new FormData();
     // debugger;
     // let uploadImg = new Blob(uploadlImagePath)
     if(uploadlImagePath){
      
         formData.append("image", uploadlImagePath);
       
     }
     formData.append('data', JSON.stringify(category)); // No second argument like type: application/json
         
         return this.http.put(environment.apiUrl + "/sub-category/"+category.id, formData, {
             headers: {
                 'Accept': 'application/json' // optional
                 // Do NOT set 'Content-Type', browser will set it as multipart/form-data automatically
             }
         });
  }

  // Method for deleting subcategory by id
  deleteSubcategoryById(subcategory: SubCategoryMaster): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/sub-category/${subcategory.id}`
    );
  }

  // Method for getting subcategory list
  getSubcategoryList(subcategory: SubCategoryMaster): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/sub-category/list`,
      subcategory
    );
  }

  // Method for getting subcategory by UUID
  getSubcategoryById(subcategory: SubCategoryMaster): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/sub-category/${subcategory.id}`
    );
  }

}