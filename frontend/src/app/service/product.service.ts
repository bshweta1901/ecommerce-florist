import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { SessionClient } from "../configuration/sessionclientstorage";
import { ProductMaster } from "../model/ProductMaster.model";
import {
    CatelogProductMaster,
    ProductCategory,
    SparePart,
} from "../model/Product";
import {
    ServiceEngineerMaster,
    UpdateEngineerRequest,
} from "../model/ServiceRequest.model";
import { User } from "../model/User.model";

const httpOptions_FILE = {
    headers: new HttpHeaders({
        "Content-Type": "Application/json; charset=UTF-8",
    }),
    responseType: "blob" as "blob",
};

@Injectable({
    providedIn: "root",
})
export class ProductService {
    constructor(
        private http: HttpClient,
        private sessionClient: SessionClient
    ) {}
    product: ProductMaster = new ProductMaster();

    setProductSession(product: ProductMaster) {
        this.sessionClient.saveSession(
            "productdetailsSession",
            JSON.stringify(product)
        );
    }

    getProductSession() {
        this.product = JSON.parse(
            localStorage.getItem("productdetailsSession")
        );
        return this.product;
    }

    getProductList(product: ProductMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "api/product/list",
            product
        );
    }

    getProductCodeList(product: ProductMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "api/product/product-code-list",
            product
        );
    }
    getProductListLength(product: ProductMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "api/product/count",
            product
        );
    }

    getProductListExport(product: ProductMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "api/product/export",
            product
        );
    }

    getProductById(product: ProductMaster): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + "api/product/" + product.uuid
        );
    }

    deleteProductById(product: ProductMaster): Observable<any> {
        return this.http.delete<any>(
            environment.apiUrl + "api/product/delete/" + product.uuid
        );
    }

    statusProductById(product: ProductMaster): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + "api/product/change-state/" + product.uuid
        );
    }

    saveProduct(product: ProductMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "api/product/save",
            product
        );
    }

    updateProduct(product: ProductMaster): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + "api/product/update",
            product
        );
    }

    getProductCategoryList(): Observable<any> {
        let obj = {} as any;
        return this.http.post<any>(
            environment.apiUrl + "/masters/list-product-category",
            obj
        );
    }

    getRepairAndProblemList(repair: ProductCategory): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/masters/list-ps-sop",
            repair
        );
    }

    getProductCategoryListV2(object: any): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/masters/list-product-category",
            object
        );
    }

    getProductCategoryUuidList(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + "/masters/get-product-category/" + uuid
        );
    }

    saveProductCategory(product: ProductCategory): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/masters/create-product-category",
            product
        );
    }

    saveRepairAndProblem(
        uuid: string,
        product: ProductCategory
    ): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/masters/update-ps-sop/${uuid}`,
            product
        );
    }

    updateProductCategory(
        uuid: string,
        product: ProductCategory
    ): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + "/masters/update-product-category/" + uuid,
            product
        );
    }

    exportCatelogList(exportCatelog: CatelogProductMaster): Observable<any> {
        return this.http.post(
            environment.apiUrl + `/product/export-excel`,
            exportCatelog,
            httpOptions_FILE
        );
    }
    getCatelogProductList(
        catelogProduct: CatelogProductMaster
    ): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/product/list",
            catelogProduct
        );
    }

    getCatelogProductCount(
        catelogProduct: CatelogProductMaster
    ): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/product/count",
            catelogProduct
        );
    }

    getManagers(user: User): Observable<any> {
        user.code = "MANAGER";
        return this.http.post<any>(environment.apiUrl + "/user/", user);
    }

    deleteCatelogProduct(uuid: string) {
        return this.http.delete(environment.apiUrl + "/product/" + uuid);
    }

    saveCatelogProduct(fd: FormData) {
        return this.http.post(environment.apiUrl + "/product/", fd);
    }

    updateCreatePackageList(uuid: string, fd: FormData): Observable<any> {
        return this.http.put<any>(environment.apiUrl + `/package/${uuid}`, fd);
    }

    saveCreatePackageUuidList(fd: FormData): Observable<any> {
        return this.http.post<any>(environment.apiUrl + "/package/", fd);
    }

    getSparePartList(saprePart: SparePart): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/spare-part/list",
            saprePart
        );
    }

    getAddSparePartList(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/product/${uuid}/spare-parts`
        );
    }

    getServicePersonById(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/service-person/${uuid}/for-admin`
        );
    }

    getPackageDetails(uuid: string): Observable<any> {
        return this.http.get<any>(environment.apiUrl + `/product/${uuid}`);
    }

    updateCatelogManager(uuid: string, fd: FormData): Observable<any> {
        return this.http.put<any>(environment.apiUrl + `/product/${uuid}`, fd);
    }

    updateServiceEngineer(uuid: string, fd: FormData): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/service-person/${uuid}`,
            fd
        );
    }

    updateStatusRequest(
        uuid: string,
        UpdateEngineerRequestObj: UpdateEngineerRequest
    ): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/masters/update-unavailability-days/${uuid}`,
            UpdateEngineerRequestObj
        );
    }

    deleteRepairAndProblem(uuid: string): Observable<any> {
        return this.http.delete<any>(
            environment.apiUrl + `/masters/delete-ps-sop/${uuid}`
        );
    }

    statusForProductCategory(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/product/change-status/${uuid}`
        );
    }

    getSettingProductCategoryList(obj): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/masters/list-product-category",
            obj
        );
    }

    getProductCategoryCount(): Observable<any> {
        let obj = {} as any;
        return this.http.post<any>(
            environment.apiUrl + "/masters/count-product-category",
            obj
        );
    }
}
