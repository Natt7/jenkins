import {Injectable} from '@angular/core';

import 'rxjs/add/operator/map';
import {environment} from './../../environments/environment';
import {HttpService} from './http.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MineService extends HttpService {
  pdorderimg = false
  pdstockimg = false
  pdcouponsimg = false


  couponIndex() {
    return this.get('shop/mine/user-coupons');
  }

  couponView(userCouponId: number) {
    return this.get('shop/mine/coupon', {
      user_coupon_id: userCouponId
    });
  }
}
