import {Component, EventEmitter, HostBinding, Input, NgModule, OnInit, Output, ViewEncapsulation, SimpleChanges } from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../service/order.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CommonModule} from '@angular/common';
import {CouponModel} from '../models/CouponModel';
import {AppRoutingModule} from 'app/bootstrap/routes';
import {CartService} from '../service/cart.service';
import {OrderModel} from '../models/OrderModel';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/merge';

@Component({
  selector: 'app-choose-coupon',
  templateUrl: './choose-coupon.html',
  styleUrls: ['./choose-coupon.css'],
  providers: [ApiService],
})
export class ChooseCouponComponent implements OnInit {
  order = new OrderModel();
  coupons: Array<CouponModel>;
  isShowPayToolbar = false;
  coupon: CouponModel;
  parseInt = parseInt;
  orderBehavior: Subject<OrderModel> = new Subject<OrderModel>();
  // @Input() code: BehaviorSubject<string>;
  @Output() showClose: EventEmitter<boolean> = new EventEmitter();
  @Input() showCouponToolbar: BehaviorSubject<boolean>;
  @Output() onCouponSelect: EventEmitter<CouponModel> = new EventEmitter();

  @Input() price:number;  
  @Input() shopId:string;  

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected cartService: CartService,
              protected titleService: Title) {
  }

  ngOnInit(): void {
    // Observable.from(this.code)
    //   .subscribe(data => {
    //     if (data === '' || data === null) {

    //     } else {
    //       this.orderService.getOrder(data).subscribe(res => {

    //         this.order = res.result;
    //         this.orderBehavior.next(this.order);
    //       });
    //     }
    //   });




    // Observable.merge(this.orderBehavior, this.showCouponToolbar)
    //   .subscribe((data) => {
    //     if (this.order.code) {



    //         console.log("嘟嘟U嘟嘟嘟嘟")
    //         console.log(data) 
    //         console.log("嘟嘟U嘟嘟嘟嘟")
    //       if (data === true || data === false) {
            // this.isShowPayToolbar = data;
    //       }
    //     }
    //   });

  }

  ngOnChanges(changes: SimpleChanges) { 
    console.log(this.price)  
    console.log(this.shopId)  
    if (this.price !== undefined) {
      this.cartService.orderUserCoupons(this.shopId, this.price).subscribe(res => {
        console.log(res.result)
        this.coupons = res.result;
        if (this.coupons.length > 0) { // 如果有优惠券订单页文字显示
          this.orderService.pdcoupon = true
        }
      });
    }
  }  

  close() {
        this.showClose.next(true);
    // this.showCouponToolbar.next(false);
  }

  use(coupon: CouponModel) {
    this.coupon = coupon;
    this.onCouponSelect.next(coupon);
    // this.showCouponToolbar.next(false);
        this.showClose.next(true);
  }

  unuse() {
    // this.cartService.orderUnuseCoupon(this.order.code).subscribe(data => {
      this.onCouponSelect.next(null);
      // this.showCouponToolbar.next(false);
          this.showClose.next(true);
      // this.coupon = undefined
      console.log(this.coupon)
    // });
  }
}


@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
  ],
  exports: [ChooseCouponComponent],
  declarations: [
    ChooseCouponComponent,
  ],
  providers: [
    CartService,
    OrderService,
  ],
})
export class ChooseCouponModule {
}
