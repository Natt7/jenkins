import {Component, OnInit, NgModule, Input, Output, EventEmitter} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../service/order.service';
import 'rxjs/add/observable/from';
import {CommonModule} from '@angular/common';
import {AppRoutingModule} from '../bootstrap/routes';
import {CartService} from '../service/cart.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CouponModel} from '../models/CouponModel';
import {environment} from '../../environments/environment';
import {UIService} from '../service/ui.service';
import {GlobalService} from '../service/global.service';
import {WechatService} from '../service/wechat.service';
declare var isMobile;
import {AddressModel} from '../models/AddressModel';
declare var wx: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class PaymentComponent implements OnInit {
  // alert文字
  textAlert = '请输入正确格式'
  pdalert = false

  title = '产品列表';
  order: any;
  isShowPaymentToolbar = false;
  coupon: CouponModel;
  isMobile = false;
  isDelivery = false;
  shopId;
  pay: any;
  test: any = ''
  test2: any = ''
  pdminiApp:any = false
  @Input() code: BehaviorSubject<string> = new BehaviorSubject(null);
  @Input() showPaymentToolbar: BehaviorSubject<boolean> = new BehaviorSubject(null);
  @Input() couponSelected: BehaviorSubject<CouponModel> = new BehaviorSubject(null);
  @Output() onPaySuccess: EventEmitter<boolean> = new EventEmitter();
  @Output() onPayError: EventEmitter<boolean> = new EventEmitter();



  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected apiService: ApiService,
              protected titleService: Title,
              protected wechatService: WechatService,
              public globalService: GlobalService,
              protected uIService: UIService) {
    this.isMobile = isMobile.phone || isMobile.tablet;
  }

  ngOnInit(): void {
    const _that = this
    this.route.params
      .subscribe(params => {
        this.shopId = params.shopId;
      });
    this.couponSelected.subscribe(data => {
      console.log(data)
      if (data !== null) {
        this.coupon = data;
      } else {
        this.coupon = null;
      }

    });
    this.showPaymentToolbar.subscribe(data => {
      if (data !== null) {
        this.isShowPaymentToolbar = data;
      }
    });
    this.onPaySuccess.subscribe(data => {
      if (data !== null) {
        this.showPaymentToolbar.next(false);
      }
    });
    this.code.subscribe(data => {
      if (data !== null) {
        this.orderService.getOrder(data).subscribe(res => {
          this.order = res.result;
          this.test = this.order.code
        });
      }
    });

    console.log("adsadasdasdasdasdas")
    wx.miniProgram.getEnv(function(res) { 
      console.log("11111111111111111111")
      console.log(res.miniprogram) // true 
      if (res.miniprogram) {
        _that.test2 = "小程序"
        _that.pdminiApp = true
      } else {
        _that.test2 = "非小程序"
        _that.pdminiApp = false
      }
      console.log("11111111111111111111")
    })
  }
  // alert消失
  qxalert() {
    this.pdalert = false;
    this.router.navigate(['index', this.shopId]);
  }
  // 微信小程序
  payMiniApp() {
        console.log(this.order.code)
    console.log(this.coupon ? this.coupon.user_coupon_id : null);
    console.log(this.route.snapshot.params.code);
    this.orderService.judgeInventory(this.order.code).subscribe(data => {
      if (data.result_code !== '10000') {
        this.pdalert = true;
        this.textAlert = data.reason;
      } else {


       // console.log(this.pay);
        this.order.brands.forEach(product => {
              product.products.forEach(r => {
                if (r.product.products_type === '虚拟') {
                  this.isDelivery = true;
                }
              })
            });
            if (this.isDelivery) {
              wx.miniProgram.navigateTo({
                url: '/pages/shop-pay/shop-pay?shopId=' + this.route.snapshot.params.shopId + '&orderId=' + this.order.code + '&orderType=virtual',
                success(e) {
                  console.log(e)
                },
                fail(e) {
                  console.log(e)
                },
              })

          //     const successUrl = `${environment.page_host}#/success/${this.route.snapshot.params.shopId}/${this.order.code}`;
          //     const errorUrl = `${environment.page_host}#/mine/order/${this.route.snapshot.params.shopId}/order`;
          //     const href = `${environment.pay_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
          // &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.order.code}`;
          //     window.location.href = href;
            } else {
              wx.miniProgram.navigateTo({
                url: '/pages/shop-pay/shop-pay?shopId=' + this.route.snapshot.params.shopId + '&orderId=' + this.order.code + '&orderType=entity',
                success(e) {
                  console.log(e)
                },
                fail(e) {
                  console.log(e)
                },
              })
          //     const successUrl = `${environment.page_host}#/delivery-success/${this.route.snapshot.params.shopId}/${this.order.code}`;
          //     // const errorUrl = `${environment.page_host}#/line-item/${this.route.snapshot.params.shopId}/${this.order.code}/${0}`;
          //     const errorUrl = `${environment.page_host}#/mine/order/${this.route.snapshot.params.shopId}/order`;
          //     const href = `${environment.pay_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
          // &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.order.code}`;
          //     window.location.href = href;
            }
      }
    });
  }
  // 微信微信
  payWechat() {
    console.log(this.order.code)
    console.log(this.coupon ? this.coupon.user_coupon_id : null);
    console.log(this.route.snapshot.params.code);
    this.orderService.judgeInventory(this.order.code).subscribe(data => {
      if (data.result_code !== '10000') {
        this.pdalert = true;
        this.textAlert = data.reason;
      } else {

        // //alert(11111);
        // this.orderService.payWechat(this.order.code).subscribe( res => {
        //   if (res.result_code === '10000') {
        //     this.pay = res.result;
        //     //alert(res.result);
        //     //alert(this.pay);
        //
        //     this.callpay(this.pay, this.isDelivery, this.route.snapshot.params.shopId, this.order.code);
        //   } else {
        //     this.pdalert = true;
        //     this.textAlert = data.reason;
        //   }
        // });


       // console.log(this.pay);
        this.order.brands.forEach(product => {
              product.products.forEach(r => {
                if (r.product.products_type === '虚拟') {
                  this.isDelivery = true;
                }
              })
            });
            if (this.isDelivery) {
              const successUrl = `${environment.page_host}#/success/${this.route.snapshot.params.shopId}/${this.order.code}`;
              const errorUrl = `${environment.page_host}#/mine/order/${this.route.snapshot.params.shopId}/order`;
              const href = `${environment.pay_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
          &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.order.code}`;
              window.location.href = href;
            } else {
              const successUrl = `${environment.page_host}#/delivery-success/${this.route.snapshot.params.shopId}/${this.order.code}`;
              // const errorUrl = `${environment.page_host}#/line-item/${this.route.snapshot.params.shopId}/${this.order.code}/${0}`;
              const errorUrl = `${environment.page_host}#/mine/order/${this.route.snapshot.params.shopId}/order`;
              const href = `${environment.pay_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
          &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.order.code}`;
              window.location.href = href;
            }
      }
    });
  }

  // //调用微信JS api 支付
  // jsApiCall(params, isDelivery, shopId , code) {
  //  // alert('aaaa');
  //  // alert(params);
  //   alert(params.appId);
  //   (window as any).WeixinJSBridge.invoke(
  //     'getBrandWCPayRequest', {
  //     "appId": params.appId,     //公众号名称，由商户传入
  //     "timeStamp": params.timeStamp,         //时间戳，自1970年以来的秒数
  //     "nonceStr": params.nonceStr, //随机串
  //     "package": params.package,
  //     "signType": params.signType,         //微信签名方式：
  //     "paySign": params.paySign //微信签名
  //     },
  //   function (res) {
  //       alert(JSON.stringify(res));
  //     if (res.err_msg === 'get_brand_wcpay_request:ok') {
  //       //alert('支付成功');
  //       alert(isDelivery);
  //         if (isDelivery) {
  //           window.location.href = `${environment.page_host}#/success/${shopId}/${code}`;
  //         } else {
  //           window.location.href = `${environment.page_host}#/delivery-success/${shopId}/${code}`;
  //         }
  //     } else {
  //       // alert('支付失败');
  //       // alert(JSON.stringify(res));
  //       if (confirm('支付失败，重新支付?')) {
  //         this.callpay(params, isDelivery, shopId , code);
  //       } else {
  //         window.location.href = `${environment.page_host}#/line-item/${shopId}/${code}`;
  //       }
  //     }
  //   }
  // );
  // }
  //
  //  callpay(params, isDelivery, shopId , code) {
  //   //alert(12344);
  //   if (typeof (window as any).WeixinJSBridge === 'undefined') {
  //     if (document.addEventListener) {
  //       document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
  //     } else if ((document as any).attachEvent) {
  //       (document as any).attachEvent('WeixinJSBridgeReady', this.jsApiCall);
  //       (document as any).attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
  //     }
  //   } else {
  //     //alert(22222);
  //     this.jsApiCall(params, isDelivery, shopId , code);
  //   }
  // }

  payWechatH5() {
    this.orderService.judgeInventory(this.order.code).subscribe(data => {
      if (data.result_code !== '10000') {
        this.pdalert = true;
        this.textAlert = data.reason;
      } else {
        // if (environment.production) {
        if (this.order.code) {
           // this.orderService.pay(this.order.code, this.coupon ? this.coupon.user_coupon_id : null).subscribe(res => {
           //   if (res.result_code === '10000') {

              this.order.brands.forEach(product => {
                product.products.forEach(r => {
                  if (r.product.products_type === '虚拟') {
                    this.isDelivery = true;
                  }
                })
              });
              if (this.isDelivery) {
                const successUrl = `${environment.page_host}#/line-item/${this.route.snapshot.params.shopId}/${this.order.code}/${1}`;
                const errorUrl = `${environment.page_host}#/line-item/${this.route.snapshot.params.shopId}/${this.order.code}/${1}`;
                const href = `${environment.pay_h5_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
          &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.order.code}`;
                window.location.href = href;
              } else {
                const successUrl = `${environment.page_host}#/line-item/${this.route.snapshot.params.shopId}/${this.order.code}/${1}`;
                const errorUrl = `${environment.page_host}#/line-item/${this.route.snapshot.params.shopId}/${this.order.code}/${1}`;
                const href = `${environment.pay_h5_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
          &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.order.code}`;
                window.location.href = href;
              }
              //     const successUrl = `${environment.page_host}#/pay-success/${this.route.snapshot.params.shopId}/${this.route.snapshot.params.code}`;
              //     const errorUrl = `${environment.page_host}#/order-detail/${this.route.snapshot.params.shopId}/${this.route.snapshot.params.code}`;
              //     const href = `${environment.pay_h5_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
              // &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.route.snapshot.params.code}`;
              //     window.location.href = href;
            // } else {
            //   //this.uIService.toast(res.reason);
            //   this.pdalert = true
            //   this.textAlert = res.reason
            // }
            // this.wechatService.getPrepareId(this.order.code).subscribe(data => {
            //   if (data.result_code === '10000') {
            //     window.location.href = data.result.mweb_url;
            //   } else {
            //     this.uIService.toast(data.reason);
             //   }
             // });
           //})
        }
      }
    });
  }
  // 支付宝
  payAlipay() {
    console.log(this.order.code)
    this.orderService.judgeInventory(this.order.code).subscribe(data => {
      if (data.result_code !== '10000') {
        this.pdalert = true;
        this.textAlert = data.reason;

      } else {
         // this.orderService.pay(this.order.code, this.coupon ? this.coupon.user_coupon_id : null).subscribe(res => {
         //   console.log(res)
         //   if (res.result_code === '10000') {
             
            this.order.brands.forEach(product => {
              product.products.forEach(r => {
                if (r.product.products_type === '虚拟') {
                  this.isDelivery = true;
                }
              })
            });
            if (this.isDelivery) {
              const successUrl = `${environment.page_host}#/success/${this.route.snapshot.params.shopId}/${this.order.code}`;
              const errorUrl = `${environment.page_host}#/mine/order/${this.route.snapshot.params.shopId}/order`;
              const href = `${environment.alipay_pay_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
          &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.order.code}`;
              window.location.href = href;
            } else {
              const successUrl = `${environment.page_host}#/delivery-success/${this.route.snapshot.params.shopId}/${this.order.code}`;
              const errorUrl = `${environment.page_host}#/mine/order/${this.route.snapshot.params.shopId}/order`;
              const href = `${environment.alipay_pay_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
          &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.order.code}`;
              window.location.href = href;
            }
            //   const successUrl = `${environment.page_host}#/pay-success/${this.route.snapshot.params.shopId}/${this.route.snapshot.params.code}`;
            //   const errorUrl = `${environment.page_host}#/order-detail/${this.route.snapshot.params.shopId}/${this.route.snapshot.params.code}`;
            //   const href = `${environment.alipay_pay_redirect}?success_redirect_uri=${encodeURIComponent(successUrl)}
            // &error_redirect_uri=${encodeURIComponent(errorUrl)}&order_no=${this.route.snapshot.params.code}`;
            //   window.location.href = href;
        //   } else {
        //     //this.uIService.toast(res.reason);
        //     this.pdalert = true
        //     this.textAlert = res.reason
         //  }
         // })
      }
    });

  }


  close() {
    this.onPaySuccess.next(false);
  }
}


@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
  ],
  exports: [PaymentComponent],
  declarations: [
    PaymentComponent,
  ],
  providers: [
    CartService,
    OrderService,
  ],
})
export class PaymentModule {
}
