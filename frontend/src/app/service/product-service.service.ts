import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SessionClient } from "../configuration/sessionclientstorage";
import { Product, ProductCategory } from "../model/Product";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CustomerProduct } from "../demo/domain/customer";
import { Package } from "../model/Package.model";

@Injectable({
    providedIn: "root",
})
export class ProductServiceService {
    constructor(
        private http: HttpClient,
        private sessionClient: SessionClient
    ) {}

    getProductList(product: Product): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/product/list",
            product
        );
    }

    getProductCategoryList(productCategory: ProductCategory): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/masters/list-product-category",
            productCategory
        );
    }

    saveCustomerProduct(customerProduct: CustomerProduct) {
        let fd = new FormData();
        fd.append("data", JSON.stringify(customerProduct));
        return this.http.post(environment.apiUrl + "/customer-product/", fd);
    }

    updateCustomerProduct(productUuid: string, fd: FormData) {
        return this.http.put<any>(
            environment.apiUrl + `/customer-product/${productUuid}`,
            fd
        );
    }

    deleteCustomerProduct(productUuid: string) {
        return this.http.delete(
            environment.apiUrl + `/customer-product/${productUuid}`
        );
    }

    getCustomerProductList(customerProduct: CustomerProduct) {
        return this.http.post(
            environment.apiUrl + "/customer-product/list",
            customerProduct
        );
    }
    getPackageList(packageMaster: Package): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/package/list",
            packageMaster
        );
    }

    deletePackageType(uuid: string) {
        return this.http.delete(environment.apiUrl + "/package/" + uuid);
    }
    getpackageById(uuid: string) {
        return this.http.get(environment.apiUrl + "/package/" + uuid);
    }

    statusForPackageType(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/package/change-status/${uuid}`
        );
    }

    statusForCustomerProduct(uuid: string): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/customer-product/change-status/${uuid}`
        );
    }
}
