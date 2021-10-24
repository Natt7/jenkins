import {Injectable} from '@angular/core';

import 'rxjs/add/operator/map';
import {HttpService} from './http.service';
import {Observable} from 'rxjs/Observable';
import {AddressModel} from '../models/AddressModel';



@Injectable()
export class OrderService extends HttpService {
  // 判断零元
  nullelement = false
  // 订单页判断有没有优惠券
  pdcoupon = false
  // 去付款的地址
  centerAddress: AddressModel

  // 存放订单商品信息
  productObject = []
  // 判断是否单品或购物车进入付款页面
  pdInMode = ''

  shopId = ''

  // 判断从我的优惠券 和购买成功页跳转回首页和商品详情页是否需要刷新
  pdJumpIndex = false



  getOrder(code: string): Observable<any> {
    return this.get('shop/order/one', {
      code: code
    });
  }

  pay(code: any, userCouponId: number): Observable<any> {
    return this.post('shop/order/pay', {
      code: code,
      user_coupon_id: userCouponId ? userCouponId : '',
    });
  }

  payButton(platform: any, product_id: any, shop_id: any, unit: any, address_id: any, user_coupon_id: any,product_attributes: any,message: any): Observable<any> {
    return this.post('shop/cart/direct-create-order', {
      platform: platform,
      product_id:product_id,
      shop_id:shop_id,
      unit:unit,
      address_id:address_id,
      user_coupon_id:user_coupon_id,
      product_attributes:product_attributes,
      message: message
    });
  }
  carPayButton(platform: any, shop_id: any, address_id: any, user_coupon_id: any,message: any): Observable<any> {
    return this.post('shop/cart/create-order', {
      platform: platform,
      shop_id: shop_id,
      address_id:address_id,
      user_coupon_id:user_coupon_id,
      message: message
    });
  }
  cencelPay(code: any): Observable<any> {
    return this.post('shop/order/cancel-order', {
      code: code,
    });
  }

// 当前页： page
// 每页限制条数： pageSize
  getOrders(page: any, pageSize:any): Observable<any> {
    return this.post('shop/order/all', {
      "page":page,
      "pageSize":pageSize
    });
  }

  getStocks(): Observable<any> {
    return this.get('shop/mine/stocks', {});
  }

  getStockCount(): Observable<any> {
    return this.get('shop/mine/count', {});
  }

  delivery(params): Observable<any> {
    return this.post('shop/delivery/delivery', params);
  }

  getDelivery(id): Observable<any> {
    return this.get('shop/delivery/get-delivery', {
      id: id
    });
  }

  getDeliveries(page: any, pageSize:any): Observable<any> {
    return this.post('shop/delivery/deliveries', {
      "page":page,
      "pageSize":pageSize
    });
  }

  createAddress(params): Observable<any> {
    return this.post('shop/delivery/create-address', params);
  }

  doDelivery(param: { address_id: any; id: any }): Observable<any> {
    return this.post('shop/delivery/do-delivery', param);
  }

  goDelivery(param: {shop_id: any, address_id: any; products: any }): Observable<any> {
    return this.post('shop/delivery/go-delivery', param);
  }

  getAddress(address_id: any): Observable<any> {
    return this.post('shop/delivery/address', {
      id: address_id
    });
  }

  successDelivery(code: any): Observable<any> {
    return this.post('shop/delivery/success-delivery', {
      code: code
    });
  }
  successCargoDelivery(id: any): Observable<any> {
    return this.post('shop/delivery/get-delivery', {
      id: id
    });
  }

  judgeInventory(code: any): Observable<any> {
    return this.post('shop/order/judge-inventory', {
      code: code
    });
  }

  queryOrder(code: any): Observable<any> {
    return this.post('shop/wechat/query-order', {
      code: code
    })
  }

  addressOrder(code: any, address_id): Observable<any> {
    return this.post('shop/order/order-user-address', {
      code: code,
      address_id: address_id
    })
  }

  payWechat(code: any) {
    return this.post('shop/wechat/pay', {
      order_no: code
    })
  }
}
