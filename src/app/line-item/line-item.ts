import {Component, OnInit, ViewEncapsulation, Inject} from '@angular/core';
import {ApiService} from '../service/api.service';
import {BaseComponent} from '../base.component';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {environment} from '../../environments/environment';
declare var isMobile;
import {OrderService} from '../service/order.service';
import {CouponModel} from '../models/CouponModel';
import {AddressModel} from '../models/AddressModel';
import {DeliveryModel} from '../models/DeliveryModel';
import {GlobalService} from '../service/global.service';
import {WechatService} from '../service/wechat.service';
import {UserService} from '../service/user.service';

@Component({
  templateUrl: './line-item.html',
  styleUrls: ['./line-item.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class LineItemComponent implements OnInit {
  title = '产品列表';

  shopId;
  shopCode: any;
  coupon: CouponModel;
  payAlert = true;
  isMobile = false;
  jumpShopCode = ''

  needIdentity = false; // 判断海外直邮
  // address = new AddressModel();
  address : any
  showAddress = false;
  delivery = new DeliveryModel();
  order: any;

  isShowCode = false
  price : number

  needAddress = false;

  // 弹窗提示
  pdalert = false
  cancelCode = ''
  pdaddressalert = false

  //订单状态
  orderState = ''
  orderStateTime = false
  orderTime: any
  minute: any
  second: any
  gaptime: any //相差毫秒数

  // 支付
  code = new BehaviorSubject<string>(null);
  showPaymentToolbar = new BehaviorSubject<boolean>(null);
  couponSelected = new BehaviorSubject<CouponModel>(null);

  constructor(protected router: Router,
              public orderService: OrderService,
              protected route: ActivatedRoute,
              public userService: UserService,
              public wechatService: WechatService,
              public globalService: GlobalService) {
this.isMobile = isMobile.phone || isMobile.tablet;
  }

  ngOnInit(): void {

    this.route.params
      .subscribe(params => {

        if ( Number(params.flag) === 1) {
          this.payAlert = true;
        } else {
          this.payAlert = false;
        }


        this.shopId = params.shopId;
        this.shopCode = params.code;
        // 获取订单信息
        this.orderService.getOrder(this.shopCode).subscribe(data => {
          console.log(data)

          for (var i = 0; i < data.result.brands.length; i++) {
            for (var ii = 0; ii < data.result.brands[i].products.length; ii++) {
              if (data.result.brands[i].products[ii].product.delivery_type === '海外直邮') {
                this.needIdentity = true;
              }
              if (data.result.brands[i].products[ii].product.products_type === '实体') {
                this.needAddress = true;
              }
            }
          }

          this.jumpShopCode = data.result.shop_code  //点击商品跳转
          this.coupon = data.result.coupon; // 获取优惠券
          this.orderState = data.result.pay_status // 获取状态

          this.address = data.result.address; // 获取地址
          if (this.address === "" && this.needAddress === true) {  // 
            this.showAddress = true;
          } 
          // console.log(this.address)

          this.order = data.result
          this.price = Number(data.result.price)

          // 未支付订单定时器
          if (this.order.pay_status === "INIT" && this.order.expired_at !== null && new Date(this.order.expired_at).getTime() - new Date().getTime() > 0) {
            this.orderStateTime = true

            this.gaptime = new Date(this.order.expired_at).getTime() - new Date().getTime() // 获取相差毫秒数

            this.minute = ( Math.floor((this.gaptime) / 60000 )).toString()
            if (Number(this.minute) < 10) {
              this.minute = "0" + this.minute
            }
            console.log("分钟数")
            console.log(this.minute)
            // console.log("秒数")
            this.second = (Math.floor((this.gaptime - (Number(this.minute) * 60000)) / 1000)).toString()
            if (Number(this.second) < 10) {
              this.second = "0" + this.second
            }
            console.log("秒数")
            console.log(this.second)

            const thiss = this
            this.orderTime = setInterval(function(){ 
              thiss.gaptime = thiss.gaptime - 1000

              thiss.minute = ( Math.floor((thiss.gaptime) / 60000 )).toString()
              if (Number(thiss.minute) < 10) {
                thiss.minute = "0" + thiss.minute
              }
              // console.log("秒数")
              thiss.second = (Math.floor((thiss.gaptime - (Number(thiss.minute) * 60000)) / 1000)).toString()
              if (Number(thiss.second) < 10) {
                thiss.second = "0" + thiss.second
              }
              // console.log(thiss.second)

              console.log(Number(thiss.minute))
              console.log(Number(thiss.second))
              if (Number(thiss.minute) === 0 && Number(thiss.second) === 0) {
                clearInterval(thiss.orderTime);
                thiss.orderState = 'CANCEL'
                thiss.order.pay_status = 'CANCEL'
              }

            }, 1000)

          }
          // console.log(new Date(this.order.expired_at).getTime()) //结束时间
          // console.log(new Date().getTime()) //现在时间

        })

      })
  }

  ngOnDestroy() {
    clearInterval(this.orderTime);
  }

  chooseAddress(model: AddressModel) {
    this.address = model;
    console.log(this.address)

    this.orderService.addressOrder(this.shopCode, this.address.id).subscribe(data => {
      console.log(data)
    })

  }
  selectRegion() {
    this.showAddress = true;
  }

  qxalert() {
    this.pdalert = false
  }
  qralert() {
    this.orderService.cencelPay(this.cancelCode).subscribe(res => {
      console.log(res)
      if (res.result_code === '10000') {
        this.router.navigate(['/mine/order', this.shopId, 'order']);
      }
    })
  }

  canclePay() {
    console.log()
    this.pdalert = true
    this.cancelCode = this.order.code
  }
  qraddressalert() {
    this.pdaddressalert = false;
  }

  pay() {
    // 如果是实体订单并且没填写地址
    if (this.needAddress === true) {
      if (this.address.id === null || this.address.id === undefined) {
        this.pdaddressalert = true;
        return false;
      }
    }

    this.code.next(this.order.code);
    if (this.order.coupon !== null && this.order.coupon !== undefined) {
      this.couponSelected.next(this.order.coupon);
    }
    this.showPaymentToolbar.next(true);
  }

  finishPay() {
    this.payAlert = false;
     this.orderService.queryOrder(this.order.code).subscribe(data => {
    //   console.log(data);
      if (data.result.query_result) {
        if (!this.needAddress) { //虚拟
          this.router.navigate(['../success', this.shopId, this.order.code]);
        } else {
          this.router.navigate(['../delivery-success', this.shopId, this.order.code]);
        }
      }
     })
  }

    onPaySuccess($event) {
    if ($event) {
      this.orderService.getOrder(this.order.code).subscribe(res => {
        this.router.navigate(['pay-success', this.shopId, res.result.code]);
      });
    }
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

  jump(product) {
    console.log(product)
    this.router.navigate(['detail', this.jumpShopCode, product.product.id]);
  }


}
