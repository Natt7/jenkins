import {HttpService} from './http.service';
import {HttpResponse} from '../models/HttpResponse';
import {Observable} from 'rxjs/Observable';
import {CouponModel} from '../models/CouponModel';
import {Injectable} from '@angular/core';

@Injectable()
export class CouponService extends HttpService {

  pdsetInterval = true; // 判断定时器
  endtime: number; // 限时结束时间
  pdtimelimit = false; //判断显示倒计时
  gaptime: number; // 相差时间毫秒数
  day: string;   // 天数
  hours: string;   // 小时数
  minutes: string;   // 分钟数
  seconds: string;   // 秒数
  kolname: string;  // kol名称
  pdsubscribe: boolean;  // pd是否订阅
  kolid: number;    // kolid
  pdlogsubscribe = false;    // 判断是否登录订阅
  pdxssubscribe = false;    // 判断显示订阅浮层
  pdendtime = false;  // 判断项目结束时间
  pdposter = false;  // 判断活动浮层

  hasCoupon(shopId: string) {
    return this.get('shop/coupon/has-coupon', {
      shop_id: shopId
    });
  }

  shopCoupons(merchantId): Observable<HttpResponse> {
    return this.get('shop/coupon/shop-coupons', {
      shop_id: merchantId,
    });
  }

  receiveCoupon(shopId: String, coupon: CouponModel) {
    return this.post('shop/coupon/receive-coupon', {
      shop_id: shopId,
      coupon_id: coupon.id
    });
  }
}
