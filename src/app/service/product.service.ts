import {Injectable} from '@angular/core';

import 'rxjs/add/operator/map';
import {HttpService} from './http.service';
import {Observable} from 'rxjs/Observable';
import {HttpResponse} from '../models/HttpResponse';

@Injectable()
export class ProductService extends HttpService {
  getProducts(shopId: string, tag_name: any, title: any): Observable<HttpResponse> {
    return this.get('shop/index/products', {
      shop_id: shopId,
      tag_name: tag_name,
      title: title
    });
  }

   getShopProductTags(shopId): Observable<HttpResponse> {
    return this.get('shop/index/product-tags', {
      shop_id: shopId,
    });
  }

  getProduct(productId: any, shopId: string): Observable<HttpResponse> {
    return this.get('shop/index/product', {
      id: productId,
      shop_id: shopId
    });
  }

  // getProducttwo(productId: any, shopId: string): Observable<HttpResponse> {
  //   return this.get('shop/index/product', {
  //     id: productId,
  //     shop_id: shopId
  //   });
  // }

  // addProducttwo(shopId: string, id: any, unit: number): Observable<HttpResponse> {
  //   // return this.get(`shop/cart/add-product?shop_id=${shopId}`, {
  //   //   id: id,
  //   //   unit: unit
  //   // });
  //   return this.get(`shop/cart/add-product`, {
  //     shop_id: shopId,
  //     id: id,
  //     unit: unit
  //   });
  // }

}
