import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/fade-in.animation';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {CouponService} from '../service/coupon.service';
import {CouponModel} from '../models/CouponModel';
import {GlobalService} from '../service/global.service';
import {BannerService} from '../service/banner.service';
import {BannerModel} from '../models/BannerModel';
import {UserService} from '../service/user.service';
import {NgxCarousel} from 'ngx-carousel';


@Component({
  moduleId: module.id.toString(),
  templateUrl: './receive-coupon.html',
  styleUrls: ['./receive-coupon.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class ReceiveCouponComponent implements OnInit {
  public carouselOne: NgxCarousel;
  coupons: Array<CouponModel> = [];
  centerCoupons: Array<CouponModel> = [];
  title = '产品列表';
  shopId: any;
  isReceiving = false;
  parseInt = parseInt;
  banners: BannerModel[] = [];

  pdalert = false
  couponHint = '优惠券领取成功'

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected indexService: CouponService,
              protected titleService: Title,
              public globalService: GlobalService,
              private bannerService: BannerService,
              private userService: UserService) {
    this.route.params.subscribe(params => {
      this.shopId = params.shopId;
      this.globalService.initShopInfo(this.shopId);
      this.globalService.statisticsPage(this.shopId, '领取优惠券').subscribe(data => {});
      this.bannerService.index(this.shopId).subscribe(data => {
        Object.assign(this.banners, data.result);
      });
      this.indexService.shopCoupons(params.shopId).subscribe(data => {
        // console.log(data.result)
        this.centerCoupons = []
        for (var i = 0; i < data.result.length; i++) {
          if (data.result[i].is_receive === 0) {
            this.centerCoupons.push(data.result[i])
          }
        }
        for (var i = 0; i < data.result.length; i++) {
          if (data.result[i].is_receive === 1) {
            this.centerCoupons.push(data.result[i])
          }
        }
        this.coupons = this.centerCoupons
        // console.log(this.coupons)
        // Object.assign(this.coupons, data.result);
        
      });

    });
  }
  ngOnInit(): void {
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            position: absolute;
            width: 100%;
            bottom: 20px;
            left: 0;
            box-sizing: border-box;
          }
          .ngxcarouselPoint li {
            display: inline-block;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.55);
            padding: 5px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngxcarouselPoint li.active {
              background: white;
              // width: 10px;
          }
        `
      },
      load: 2,
      touch: true,
      loop: true,
      custom: 'banner',
      easing: 'ease'
    };
  }
  receive(coupon: CouponModel) {
    if (this.userService.judgeUserMobile()) {
      if (!this.isReceiving) {
        this.isReceiving = true;
        this.indexService.receiveCoupon(this.shopId, coupon).subscribe(data => {

          if (data.reason === "请求成功") {
            this.indexService.shopCoupons(this.shopId)
            .subscribe(coupons => {
              this.centerCoupons = []
              for (var i = 0; i < coupons.result.length; i++) {
                if (coupons.result[i].is_receive === 0) {
                  this.centerCoupons.push(coupons.result[i])
                }
              }
              for (var i = 0; i < coupons.result.length; i++) {
                if (coupons.result[i].is_receive === 1) {
                  this.centerCoupons.push(coupons.result[i])
                }
              }
              this.coupons = this.centerCoupons
              this.pdalert = true
              this.isReceiving = false;
            });

          } else {
            this.couponHint = data.reason;
            this.pdalert = true;
            this.isReceiving = false;
          }


        })
      } else {
        return false;
      }
    }
  }
  qxalert() {
    this.pdalert = false
    this.couponHint = '优惠券领取成功'
  }
}
