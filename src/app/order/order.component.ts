import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {BaseComponent} from '../base.component';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../service/order.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {RewardService} from '../service/reward.service';
import {GlobalService} from '../service/global.service';
import {MineService} from '../service/mine.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CouponModel} from '../models/CouponModel';

@Component({
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class OrderComponent implements OnInit {
  stockCount: any;

  title = '产品列表';

  shopId;

  orders: Array<any> = [];
  rewards = [];
  deliveries = [];
  activeTab = 'order';

  // 弹窗提示
  pdalert = false
  cancelCode = ''

  // 付款
  code = new BehaviorSubject<string>(null);
  couponSelected = new BehaviorSubject<CouponModel>(null);
  showPaymentToolbar = new BehaviorSubject<boolean>(null);
  payCode = ''

  // 缺少地址
  pdaddressalert = false
  addresscode = ''
  // 分页
  orderPage = 0 // 订单页数
  orderSumPage = 0 //订单总页数
  pdorderMore = true
  moreOrders: Array<any> = [];
  deliveryPage = 0 // 货单页数
  deliverySumPage = 0 //货单总页数
  pddeliveryMore = true
  deliveryOrders: Array<any> = [];
  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected apiService: ApiService,
              protected rewardService: RewardService,
              protected globalService: GlobalService,
              public mineService: MineService,
              protected titleService: Title) {

  }

  ngOnInit(): void {
    this.mineService.pdorderimg = true
    this.mineService.pdstockimg = false
    this.mineService.pdcouponsimg = false


    Observable.from(this.route.params)
      .subscribe(params => {
        this.shopId = params.shopId;
        this.globalService.initShopInfo(this.shopId);

        this.globalService.statisticsPage(this.shopId, '我的订单').subscribe(data => {
        });

        this.activeTab = params.active;

        this.orderService.getOrders(this.orderPage, 10).subscribe(res => {
          this.orders = res.result;
          for (var i = 0; i < this.orders.length; i++) {
            if (this.orders[i].coupon !== null && this.orders[i].coupon !== undefined) {
              this.orders[i].orderPrice = this.toDecimal2(Number(this.orders[i].price) - Number(this.orders[i].coupon.discount))
            }
          }
          //计算订单总页数
          this.orderSumPage = Math.ceil(res.page.total / 10)
          if (this.orderSumPage === 1 || res.page.total === 0) {
            this.pdorderMore = false
          }
        });
        this.orderService.getDeliveries(this.deliveryPage, 10).subscribe(res => {
          this.deliveries = res.result;
          //计算货单总页数
          this.deliverySumPage = Math.ceil(res.page.total / 10)
          if (this.deliverySumPage === 1 || res.page.total === 0) {
            this.pddeliveryMore = false
          }
        });
        this.rewardService.getRewards().subscribe(res => {
          this.rewards = res.result;
        });
        this.orderService.getStockCount().subscribe(res => {
          this.stockCount = res.result.count
        })
      })






  }
  //加载更多订单
  orderMore() {
    this.orderPage++
    console.log(this.orderPage)
    if (this.orderPage === this.orderSumPage) {
      this.pdorderMore = false
    }
    this.orderService.getOrders(this.orderPage, 10).subscribe(res => {
        this.moreOrders = res.result;
        for (var i = 0; i < this.moreOrders.length; i++) {
          if (this.moreOrders[i].coupon !== null && this.moreOrders[i].coupon !== undefined) {
            this.moreOrders[i].orderPrice = this.toDecimal2(Number(this.moreOrders[i].price) - Number(this.moreOrders[i].coupon.discount))
          }
        }
        for (var i = 0; i < this.moreOrders.length; i++) {
          this.orders.push(this.moreOrders[i])
        }
    });
  }
  //加载更多货单
  deliveryMore() {
    this.deliveryPage++
    console.log(this.deliveryPage)
    if (this.deliveryPage === this.deliverySumPage) {
      this.pddeliveryMore = false
    }
    this.orderService.getDeliveries(this.deliveryPage, 10).subscribe(res => {
        this.deliveryOrders = res.result;
        for (var i = 0; i < this.deliveryOrders.length; i++) {
          this.deliveries.push(this.deliveryOrders[i])
        }
    });
  }
  qxalert() {
    this.pdalert = false
  }
  qralert() {
    this.orderService.cencelPay(this.cancelCode).subscribe(res => {
      this.orderService.getOrders(this.orderPage, 10).subscribe(res => {
        this.orders = res.result;
        for (var i = 0; i < this.orders.length; i++) {
          if (this.orders[i].coupon !== null && this.orders[i].coupon !== undefined) {
            this.orders[i].orderPrice = this.toDecimal2(Number(this.orders[i].price) - Number(this.orders[i].coupon.discount))
          }
        }
      });
      this.pdalert = false

    })
  }

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


  goDeliveryDetail(delivery) {
    if (delivery.delivery_status === 'INIT') {
      this.router.navigate(['delivery', this.shopId, delivery.code]);
    } else if (delivery.delivery_status === 'DELIVERING') {
      this.router.navigate(['delivery-success-cargo', this.shopId, delivery.id]);
    } else {
    }
  }

  goIndex() {
    this.router.navigate(['index', this.shopId])
  }

  goMine() {
    this.router.navigate(['mine', this.shopId])
  }

  goRewardDetail(reward) {
    if (reward.reward_status !== 'REWARD') {
      this.router.navigate(['/reward', this.shopId, reward.id])
    }
  }
  // 去付款
  goOrderDetail(order) {
    var productType = false;
    for (var i = 0; i < order.brands.length; i++) {
      for (var ii = 0; ii < order.brands[i].products.length; ii++) {
        if (order.brands[i].products[ii].product.products_type === "实体") {
          productType = true;
        }
      }
    }


    if (productType === true && order.address === '') {
      this.pdaddressalert = true
      this.addresscode = order.code
    } else {
      this.payCode = order.code
      this.code.next(this.payCode);
      if (order.coupon !== null && order.coupon !== undefined) {
        this.couponSelected.next(order.coupon);
      }
      this.showPaymentToolbar.next(true);
    }
  }

  qraddressalert() {
    this.router.navigate(['line-item', this.shopId, this.addresscode, 0]);
  }

  canclePay(order) {
    console.log(order)
    this.pdalert = true
    this.cancelCode = order.code
  }

  goLineItem(code) {
    console.log(code)
    this.router.navigate(['line-item', this.shopId, code, 0]);
  }


  onPaySuccess($event) {
    if ($event) {
      this.orderService.getOrder(this.payCode).subscribe(res => {
        this.router.navigate(['pay-success', this.shopId, res.result.code]);
      });
    }
  }
}
