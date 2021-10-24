import {Injectable} from '@angular/core';

import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpService} from './http.service';

@Injectable()
export class CartService extends HttpService {
  cartCountSubject = new Subject<any>();
  cartsSubject = new Subject<any>();
  pdoneaddress = false

  sendCartCount(message: number) {
    this.cartCountSubject.next(message);
  }

  clearMessage() {
    this.cartCountSubject.next();
  }

  getCartCountObservable(): Observable<any> {
    return this.cartCountSubject.asObservable();
  }

  updateCartCount(shopId: string) {
    this.getCartCount(shopId)
      .subscribe(res => {
        this.sendCartCount(res.result.count ? res.result.count : 0)
      });
  }

  getCartCount(shopId: string): Observable<any> {
    return this.get(`shop/cart/count?shop_id=${shopId}`);
  }


  sendCarts(message: any) {
    this.cartsSubject.next(message);
  }

  clearCarts() {
    this.cartsSubject.next();
  }

  getCarts(): Observable<any> {
    return this.cartsSubject.asObservable();
  }

  updateCarts(shopId: string) {
    this.getProducts(shopId).subscribe(res => {
      this.sendCarts(res.result);
    });
  }

  addProduct(shopId: string, id: any, unit: number, product_attributes: any): Observable<any> {
    return this.post(`shop/cart/add-product?shop_id=${shopId}`, {
      id: id,
      unit: unit,
      product_attributes: product_attributes
    });
  }

  //  addProducttwo(shopId: string, id: any, unit: number): Observable<HttpResponse> {
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

  getProducts(shopId: string): Observable<any> {
    return this.get(`shop/cart/products?shop_id=${shopId}`);
  }

  deleteProduct(shopId, i: any): Observable<any> {
    return this.post('shop/cart/delete-product', {
      id: i,
      shop_id: shopId
    });
  }

  createOrder(shopId, platform: string = null): Observable<any> {
    return this.post('shop/cart/create-order', {
      shop_id: shopId,
      platform: platform,
    });
  }

  directCreateOrder(shopId: string, id: any, unit: number, platform: string = null) {
    return this.post('shop/cart/direct-create-order', {
      shop_id: shopId,
      product_id: id,
      unit: unit,
      platform: platform,
    });
  }

  plusUnit(id): Observable<any> {
    return this.post('shop/cart/plus-unit', {
      id: id
    });
  }

  minusUnit(id): Observable<any> {
    return this.post('shop/cart/minus-unit', {
      id: id
    });
  }


  orderUserCoupons(shop_code: string, price: number) {
    return this.post('shop/cart/order-user-coupons', {
      shop_code: shop_code,
      price:price
    });
  }

  orderUnuseCoupon(code: string) {
    return this.post('shop/cart/order-unuse-coupon', {
      code: code,
    });
  }

  recentOrder(shop_id: any) {
    return this.post('shop/index/new-order', {
      shop_id: shop_id,
    });
  }
}
