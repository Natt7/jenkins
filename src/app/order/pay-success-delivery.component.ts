import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {BaseComponent} from '../base.component';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {OrderService} from '../service/order.service';
import {ActivatedRoute, Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {UIService} from '../service/ui.service';
import {AddressModel} from '../models/AddressModel';
import {DeliveryModel} from '../models/DeliveryModel';
import {GlobalService} from '../service/global.service';


@Component({
  templateUrl: './pay-success-delivery.component.html',
  styleUrls: ['./pay-success-delivery.component.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class PaySuccessDeliveryComponent implements OnInit {
  // 判断路由守卫
  pdLeaveGuarddelivery = false;
  // alert文字
  textAlert = '请输入正确格式';
  pdalert = false;

  order: any;
  shopId: any;
  address = new AddressModel();
  delivery = new DeliveryModel();
  showAddress = false;
  needIdentity = false;
  needAddress = false;
  code: any;
  price: any;
  product_amount: any;
  deliveryProductParams = [];
  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected apiService: ApiService,
              protected globalService: GlobalService,
              protected titleService: Title,
              protected UIService: UIService) {

  }

  ngOnInit(): void {
    // 到达页面立刻出现选择地址
    this.showAddress = true;

    Observable.from(this.route.params)
      .subscribe(params => {
        this.shopId = params.shopId;
        this.code = params.code;
        this.globalService.initShopInfo(this.shopId);

        this.globalService.statisticsPage(this.shopId, '发货页面').subscribe(data => {});

        // this.deliveryId = params.id;
        //
        // this.orderService.getDelivery(this.deliveryId).subscribe(r => {
        //   this.delivery = r.result;
        //   this.delivery.products.forEach(product => {
        //     if (product.product.delivery_type === '海外直邮') {
        //       this.needIdentity = this.needIdentity || true;
        //     }
        //   });
        // });
        //新改发货逻辑，
        this.orderService.getOrder(params.code).subscribe(res => {
          this.order = res.result;
          this.price = res.result.price;
          this.product_amount = res.result.product_amount;
          this.order.brands.forEach(brand => {
            this.delivery.products = brand.products;
            brand.products.forEach(product => {
              this.deliveryProductParams.push({
                  product_id: product.product_id,
                  amount: product.amount
              });
              if (product.product.delivery_type === '海外直邮') {
                this.needIdentity = this.needIdentity || true;
              }
              if (product.product.products_type === '实体') {
                 this.needAddress = true;
              }
            })
          });
          // if (this.order.pay_status !== 'SUCCESS') {
          //   this.router.navigate(['order-detail', this.shopId, this.order.code]);
          // }
        });
        //
        // this.orderService.getOrder(this.code).subscribe(res => {
        //    this.delivery = r.result;
        //    console.log(this.delivery);
        //    this.delivery.brands.forEach(brands => {
        //      brands.products.forEach(product => {
        //        if (product.product.delivery_type === '海外直邮') {
        //          this.needIdentity = this.needIdentity || true;
        //        }
        //      });
        //    });
        // });
      });


    // console.log(this.address)
  }
  // alert消失
  qxalert() {
    this.pdalert = false
  }
  doDelivery() {
    if (this.address.id == null) {
      this.pdalert = true;
      this.textAlert = '请选择收获地址';
      return false;
    }
    this.orderService.goDelivery({
      shop_id: this.shopId,
      address_id: this.address.id,
      products: this.deliveryProductParams
    }).subscribe(res => {
       if (res.result_code === '10000') {
         this.pdLeaveGuarddelivery = true
         this.router.navigate(['delivery-success', this.shopId, res.result.id])
       }else {
         this.UIService.toast(res.reason);
         this.pdalert = true;
         this.textAlert = res.reason;
       }
    });

    // this.orderService.doDelivery({
    //   address_id: this.address.id,
    //   id: this.deliveryId
    // }).subscribe(res => {
    //   if (res.result_code === '10000') {
    //     this.router.navigate(['delivery-success', this.shopId, res.result.id])
    //   } else {
    //     this.UIService.toast(res.reason);
    //     this.pdalert = true
    //     this.textAlert = res.reason
    //   }
    // });
  }

  selectRegion() {
    this.showAddress = true;
  }

  chooseAddress(model: AddressModel) {
    this.address = model;
  }

  goIndex() {
    this.router.navigate(['index', this.shopId])
  }

  goCart() {
    this.router.navigate(['cart', this.shopId])
  }
}
