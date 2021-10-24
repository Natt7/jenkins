import {Component, ViewEncapsulation, HostBinding, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {slideInOutAnimation} from './../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {UserService} from '../service/user.service';
import {GlobalService} from '../service/global.service';
import {OrderService} from '../service/order.service';
import {ProductService} from '../service/product.service';
import {CouponService} from '../service/coupon.service';
@Component({
  moduleId: module.id.toString(),
  templateUrl: './timeout.html',
  styleUrls: ['./timeout.css'],
  animations: [slideInOutAnimation()],
})
export class TimeoutComponent implements OnInit {
  title = '产品列表';
  stockCount = 0;
  shopId: string;
  @HostBinding('@slideInOutAnimation') slideInOutAnimation;
  tags: any[];
  constructor(protected apiService: ApiService,
              protected router: Router,
              protected route: ActivatedRoute,
              protected titleService: Title,
              protected location: Location,
              public couponService: CouponService,
              public userService: UserService,
              public orderService: OrderService,
              public productService: ProductService,
              public globalService: GlobalService) {
    this.route.params.subscribe(params => {
      this.shopId = params.shopId;
      this.globalService.initShopInfo(this.shopId);
    });
  }
  ngOnInit(): void {

  }

  // 订阅按钮
  subscribeclick() {
    console.log(this.couponService.kolid)
    console.log(this.userService.pdregistered)
    if (this.userService.pdregistered === false) {   // 没注册
      this.couponService.pdlogsubscribe = true     // 是否登录订阅
      this.router.navigate(['login']);
    }
    if (this.userService.pdregistered === true) {     // 已注册
      this.userService.subscribe(this.couponService.kolid).subscribe(s => {
        this.couponService.pdsubscribe = true;   // 判断订阅为true
        //console.log(s)
        this.couponService.pdxssubscribe = true //  判断显示为true
      });
    }
  }
  subscribelayer() {
    this.couponService.pdxssubscribe = false //  判断显示为false
  }
}
