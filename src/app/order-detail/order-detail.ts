import {Component, OnInit, ViewEncapsulation, Inject} from '@angular/core';
import {ApiService} from '../service/api.service';
import {BaseComponent} from '../base.component';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../service/order.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CouponModel} from '../models/CouponModel';
import {GlobalService} from '../service/global.service';
import {environment} from '../../environments/environment';
declare var isMobile;
import {DeliveryModel} from '../models/DeliveryModel';
import {AddressModel} from '../models/AddressModel';
import {BrandModel} from '../models/BrandModel';
import {CartService} from '../service/cart.service';
@Component({
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class OrderDetailComponent implements OnInit {
  title = '产品列表';
  shopId;
  order: any;
  code = new BehaviorSubject<string>(null);
  showCouponSelect = new BehaviorSubject<boolean>(null);
  showPaymentToolbar = new BehaviorSubject<boolean>(null);
  couponSelected = new BehaviorSubject<CouponModel>(null);
  coupon: CouponModel;
  maxCoupon: CouponModel;
  payAlert = true;
  // alert文字
  textAlert = '请输入正确格式';
  pdalert = false;
  isMobile = false;
  isDelivery = false;

  //选择地址
  showAddress = false;
  stockInfo = [];
  needIdentity = false;
  delivery = new DeliveryModel();
  deliveryProductParams = [];
  address = new AddressModel();
  shopCode: any;
  needAddress = false;
  pdaddressalert = false;

  brandArr: Array<BrandModel> = []
  price = 0
  showCoupon = false
  orderCode: string

  ceshi = 0

  remark: any = "" //留言

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              public orderService: OrderService,
              protected apiService: ApiService,
              protected cartService: CartService,
              public globalService: GlobalService,
              protected titleService: Title) {
    this.isMobile = isMobile.phone || isMobile.tablet;
  }

  ngOnInit(): void {

    this.route.params
      .subscribe(params => {

        // this.shopId = this.orderService.shopId
        this.shopId = localStorage.getItem('dudushopId');
        console.log(this.shopId)
        // this.shopId = params.shopId;
        this.shopCode = params.code;
        // console.log(this.shopCode)
        // console.log("codecodecodecode")
        this.globalService.initShopInfo(this.shopId);
        if ( Number(params.flag) === 1) {
          this.payAlert = true;
        } else {
          this.payAlert = false;
        }

        this.globalService.statisticsPage(this.shopId, '订单详情').subscribe(data => {
        });


        this.orderService.productObject = JSON.parse(localStorage.getItem('productObject'));
        console.log(this.orderService.productObject)

        for (var i = 0; i < this.orderService.productObject.length; i++) {  // 获取所有商品的渠道
          this.brandArr.push(this.orderService.productObject[i].product.brand)

          if (this.orderService.productObject[i].product.products_type === '虚拟') {
            this.isDelivery = true;
          }
          if (this.orderService.productObject[i].product.delivery_type === '海外直邮') {
            this.needIdentity = this.needIdentity || true;
          }
          // this.needIdentity = true
          if (this.orderService.productObject[i].product.products_type === '实体') {
             this.needAddress = true;
              // 到达页面立刻出现选择地址
              this.showAddress = true;
          }

          var priceOne = Number(this.orderService.productObject[i].product.price) * this.orderService.productObject[i].unit
          this.price += priceOne
          // console.log(this.price)

        }
        // this.brandArr = Array.from(new Set(this.brandArr)) //去重
        // this.code.next("0");
        function unique5(array){ 
          var r = []; 
          for(var i = 0, l = array.length; i < l; i++) { 
           for(var j = i + 1; j < l; j++) 
            if (array[i].id === array[j].id) j = ++i; 
             r.push(array[i]); 
           } 
          return r; 
        }
        this.brandArr = unique5(this.brandArr)

      this.cartService.orderUserCoupons(this.shopId, this.price).subscribe(res => {

        if (res.result.length > 0) { 
          this.orderService.pdcoupon = true // 如果有优惠券订单页文字显示
          // 找出优惠最大的优惠券
          this.maxCoupon =  res.result[0]
          for (var i = 0; i < res.result.length; i++) {
            if (Number(this.maxCoupon.discount) <= Number(res.result[i].discount)) {
              this.maxCoupon = res.result[i]
            }
          }
          console.log(this.maxCoupon)
          this.coupon = this.maxCoupon;
          this.couponSelected.next(this.maxCoupon);
          
        } else {
          this.orderService.pdcoupon = false
        }
      });


      })
  }

  chooseCoupon() {
    // console.log("aaaas")
    this.showCoupon = true
    // this.showCouponSelect.next(true);
  }

  // finishPay() {
  //   this.payAlert = false;
  //    this.orderService.queryOrder(this.order.code).subscribe(data => {
  //   //   console.log(data);
  //     if (data.result.query_result) {
  //       if (this.isDelivery) { //虚拟
  //         this.router.navigate(['../success', this.shopId, this.order.code]);
  //       } else {
  //         this.router.navigate(['../pay-success-delivery', this.shopId, this.order.code]);
  //       }
  //     }
  //    })
  // }

  onCouponSelect($event) {
    this.coupon = $event;
    this.couponSelected.next($event);
  }

  // alert消失
  qxalert() {
    this.pdalert = false;
    // this.router.navigate(['index', this.shopId]);
  }
  addressalert() {
     this.pdaddressalert = false;
  }
  pay() {


    if (this.isDelivery === true) {
      console.log("虚拟")
    } else {
      console.log("实体")
      if (this.address.id == null) {
        this.pdaddressalert = true;
        this.textAlert = '请选择收获地址';
        return false;
      }
    }


    if (this.price - (this.coupon ? this.coupon.discount : 0) <= 0) {  // 判断结算金额是不是0元
      this.orderService.nullelement = true
    }

    this.orderService.pdInMode = localStorage.getItem('pdInMode');
    console.log(this.orderService.pdInMode)
    if (this.orderService.pdInMode === "单品") {
      // console.log(this.globalService.isWechat() ? 'WECHAT' : 'WAP')
      // console.log(this.orderService.productObject[0].product.id)
      // console.log(this.shopId)
      // console.log(this.orderService.productObject[0].unit)
      // console.log(this.address.id)
      // console.log(this.coupon)
      var couponId = null
      if (this.coupon === undefined || this.coupon === null) {
        couponId = null
      } else {
        couponId = this.coupon.user_coupon_id
      }  
      this.orderService.payButton(
        this.globalService.isWechat() ? 'WECHAT' : 'WAP', 
        this.orderService.productObject[0].product.id, 
        this.shopId, 
        this.orderService.productObject[0].unit, 
        this.address.id, 
        couponId,
        this.orderService.productObject[0].attribute,
        this.remark
        ).subscribe(data => {

        if (data.result_code !== '10000') {
          this.pdalert = true;
          this.textAlert = data.reason;
          return false;
        } else {
            this.orderCode = data.result.code
            this.code.next(this.orderCode);
            // 判断是否是零元
            if (this.orderService.nullelement === true) { // 是
              this.orderService.pay(this.orderCode, couponId).subscribe(res => {
                if (this.isDelivery) {
                  const successUrl = `${environment.page_host}#/success/${this.shopId}/${this.orderCode}`;
                  const errorUrl = `${environment.page_host}#/line-item/${this.shopId}/${this.orderCode}/${0}`;
                  const href = `${environment.pay_zone_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
            &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.orderCode}`;
                  window.location.href = href;
                } else {
                  const successUrl = `${environment.page_host}#/delivery-success/${this.shopId}/${this.orderCode}`;
                  const errorUrl = `${environment.page_host}#/line-item/${this.shopId}/${this.orderCode}/${0}`;
                  const href = `${environment.pay_zone_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
            &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.orderCode}`;
                  window.location.href = href;
                }
              });
  
            } else {  // 不是
              this.orderService.centerAddress = this.address
              this.showPaymentToolbar.next(true);
            }
        }
      })

    }
    if (this.orderService.pdInMode === "购物车") {
      console.log(this.globalService.isWechat() ? 'WECHAT' : 'WAP')
      console.log(this.shopId)
      console.log(this.address.id)
      console.log(this.coupon)
      var couponId = null
      if (this.coupon === undefined || this.coupon === null) {
        couponId = null
      } else {
        couponId = this.coupon.user_coupon_id
      }  
      this.orderService.carPayButton(
        this.globalService.isWechat() ? 'WECHAT' : 'WAP', 
        this.shopId, 
        this.address.id, 
        couponId,
        this.remark
        ).subscribe(data => {

        if (data.result_code !== '10000') {
          this.pdalert = true;
          this.textAlert = data.reason;
          return false;
        } else {
            this.orderCode = data.result.code
            this.code.next(this.orderCode);
            // 判断是否是零元
            if (this.orderService.nullelement === true) { // 是
              this.orderService.pay(this.orderCode, couponId).subscribe(res => {
                if (this.isDelivery) {
                  const successUrl = `${environment.page_host}#/success/${this.shopId}/${this.orderCode}`;
                  const errorUrl = `${environment.page_host}#/line-item/${this.shopId}/${this.orderCode}/${0}`;
                  const href = `${environment.pay_zone_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
            &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.orderCode}`;
                  window.location.href = href;
                } else {
                  const successUrl = `${environment.page_host}#/delivery-success/${this.shopId}/${this.orderCode}`;
                  const errorUrl = `${environment.page_host}#/line-item/${this.shopId}/${this.orderCode}/${0}`;
                  const href = `${environment.pay_zone_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
            &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.orderCode}`;
                  window.location.href = href;
                }
              });
  
            } else {  // 不是
              this.orderService.centerAddress = this.address
              this.showPaymentToolbar.next(true);
            }
        }
      })

    }



      //     platform: "WECHAT",
      // product_id:1092,
      // shop_id:"a711effc-14a1-425d-bcdb-577304bfcf48",
      // unit:1,
      // address_id:22,
      // user_coupon_id:""

    // this.orderService.judgeInventory(this.order.code).subscribe(data => {
    //  // console.log(data)
    //   if (data.result_code !== '10000') {
    //     this.pdalert = true;
    //     this.textAlert = data.reason;
    //     return false;
    //   } else {
        // this.orderService.pay(this.order.code, this.coupon ? this.coupon.user_coupon_id : null).subscribe(res => {
          // 判断是否是零元
          // if (this.orderService.nullelement === true) { // 是
          //   this.orderService.pay(this.order.code, this.coupon ? this.coupon.user_coupon_id : null).subscribe(res => {
          //     if (this.isDelivery) {
          //       const successUrl = `${environment.page_host}#/success/${this.shopId}/${this.order.code}`;
          //       const errorUrl = `${environment.page_host}#/order-detail/${this.shopId}/${this.order.code}/${0}`;
          //       const href = `${environment.pay_zone_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
          // &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.order.code}`;
          //       window.location.href = href;
          //     } else {
          //       const successUrl = `${environment.page_host}#/pay-success-delivery/${this.shopId}/${this.order.code}`;
          //       const errorUrl = `${environment.page_host}#/order-detail/${this.shopId}/${this.order.code}/${0}`;
          //       const href = `${environment.pay_zone_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
          // &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.order.code}`;
          //       window.location.href = href;
          //     }
          //   });

          // } else {  // 不是
          //   this.orderService.centerAddress = this.address
          //   this.showPaymentToolbar.next(true);
          // }
        // });
    //   }
    // });

  }

  onPaySuccess($event) {
    if ($event) {
      this.orderService.getOrder(this.orderCode).subscribe(res => {
        this.router.navigate(['pay-success', this.shopId, res.result.code]);
      });
    }
  }
  chooseAddress(model: AddressModel) {
    this.address = model;
  }
  selectRegion() {
    this.showAddress = true;
  }
    // 两位小数
  toDecimal2(x) {    
      var f = parseFloat(x);    
      if (isNaN(f)) {    
          return false;    
      }    
      var f = Math.round(x*100)/100;    
      var s = f.toString();    
      var rs = s.indexOf('.');    
      if (rs < 0) {    
          rs = s.length;    
          s += '.';    
      }    
      while (s.length <= rs + 2) {    
          s += '0';    
      }    
      return s;    
  }   
}
