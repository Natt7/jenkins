import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CouponModel} from '../models/CouponModel';
import {Observable} from 'rxjs/Observable';
import {HttpResponse} from '../models/HttpResponse';
import {ShopModel} from '../models/ShopModel';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';

@Injectable()
export class GlobalService extends HttpService {

  shopModel: ShopModel = new ShopModel();
  shopInfoBehavior: BehaviorSubject<ShopModel> = new BehaviorSubject<ShopModel>(null);

  pdneworder = false // 判断首页新订单

  shopInfo(shopId: string): Observable<HttpResponse> {
    return this.get(`shop/index/info?shop_id=${shopId}`);
  }

  initShopInfo(shopId: any) {
    this.shopInfo(shopId).subscribe(data => {
      document.title = data.result.shop_name;
      Object.assign(this.shopModel, data.result);
      this.shopInfoBehavior.next(this.shopModel);
    });
  }
  isWechat() {
    if (window.navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
      return true;
    } else {
      return false;
    }
  }
  statistics(shopId: string, model: any) {
    model['tempId'] = this.localStorage.getItem('tempId');
    return this.post(`shop/index/statistics?shop_id=${shopId}`, model);
  }

  initSubscription(shopId: any) {
    return this.post(`shop/index/subscription?shop_id=${shopId}`);
  }

  statisticsPage(shopId: any, s: string) {
    const model = {
      visited: s,
      fromShare: null,
      depth: 1,
      tempId: this.localStorage.getItem('tempId'),
    };
    return this.post(`shop/index/statistics?shop_id=${shopId}`, model);
  }

  statisticsRegister(shopId: any, s: string) {
    const model = {
      visited: s,
      fromShare: null,
      depth: 1,
      registered: true,
      tempId: this.localStorage.getItem('tempId'),
    };
    return this.post(`shop/index/statistics?shop_id=${shopId}`, model);
  }
}
