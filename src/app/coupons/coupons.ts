import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/fade-in.animation';
import {ProductService} from '../service/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {CartService} from '../service/cart.service';
import {environment} from '../../environments/environment';
import {OrderService} from '../service/order.service';

declare var wx: any

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {CouponService} from '../service/coupon.service';
import {CouponModel} from '../models/CouponModel';
import {MineService} from '../service/mine.service';


@Component({
  moduleId: module.id.toString(),
  templateUrl: './coupons.html',
  styleUrls: ['./coupons.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class CouponsComponent {
  coupons: Array<CouponModel>;
  title = '产品列表';
  shopId: any;
  isReceiving = false;
  parseInt = parseInt;

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected mineService: MineService,
              protected titleService: Title) {

    this.mineService.pdorderimg = false
    this.mineService.pdstockimg = false
    this.mineService.pdcouponsimg = true

    Observable
      .from(this.route.params)
      .switchMap(data => {
        return this.mineService.couponIndex();
      })
      .map(data => {
        return data.result;
      })
      .subscribe(data => {
        this.coupons = data;
        console.log(this.coupons)
      });
  }

  use(coupon) {
    this.mineService.couponView(coupon.user_coupon_id).subscribe(data => {
      // setTimeout(function(){
        // console.log("aaaaa")
        // window.location.href = `${environment.page_host}#/index/${data.result.channel_code}`;
      console.log(this.orderService.pdJumpIndex)
      this.orderService.pdJumpIndex = true  //回到首页或商品详情页需要刷新    
      this.router.navigate(['index', data.result.channel_code]);
      // window.location.reload();
      // },2000)
    });
  }
}
