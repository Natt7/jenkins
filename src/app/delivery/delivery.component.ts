import {Component, OnInit, ViewEncapsulation, Inject} from '@angular/core';
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
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class DeliveryComponent implements OnInit {
  // alert文字
  textAlert = '请输入正确格式'
  pdalert = false

  deliveryId: any;
  shopId: any;
  address = new AddressModel();
  delivery = new DeliveryModel();
  showAddress = false;
  needIdentity = false;
  deliveryProductParams = [];
  stockInfo = [];
  // 判断路由守卫
  pdLeaveGuarddelivery = false;

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected apiService: ApiService,
              protected globalService: GlobalService,
              protected titleService: Title,
              protected UIService: UIService,
              @Inject('LOCALSTORAGE') protected localStorage: any) {

  }

  ngOnInit(): void {
    // 到达页面立刻出现选择地址
    this.showAddress = true;

    this.stockInfo = JSON.parse(this.localStorage.getItem('stockProducts'));
    console.log(this.stockInfo)
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    Observable.from(this.route.params)
      .subscribe(params => {
        this.shopId = params.shopId;

        this.globalService.initShopInfo(this.shopId);
        // 上报
        this.globalService.statisticsPage(this.shopId, '发货页面').subscribe(data => {
        });

        this.delivery.price = 0;
        this.delivery.unit = 0;
        this.stockInfo.forEach(product => {
          product.product.product_price = product.price;
          product.product.unit = product.amount;
          this.delivery.products.push(product);
          this.delivery.price += product.price * product.amount;
          this.delivery.unit += product.amount;
          if (product.product.delivery_type === '海外直邮') {
            this.needIdentity = this.needIdentity || true;
          }

          this.deliveryProductParams.push({
            product_id: product.product_id,
            amount: product.amount
          });
        });
       // console.log(this.delivery);

        // this.delivery = this.orderService.productBehavior;
        // this.orderService.getDelivery(this.deliveryId).subscribe(r => {
        //   this.delivery = r.result;
        //   this.delivery.products.forEach(product => {
        //     if (product.product.delivery_type === '海外直邮') {
        //       this.needIdentity = this.needIdentity || true;
        //     }
        //   });
        // });
      })

    console.log(this.address)
  }
  // alert消失
  qxalert(){
    this.pdalert = false
  }

  doDelivery() {
    if (this.address.id == null) {
      //this.UIService.toast('请选择收获地址');
      this.pdalert = true
      this.textAlert = '请选择收获地址'
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
      } else {
        this.UIService.toast(res.reason);
        this.pdalert = true
        this.textAlert = res.reason
      }
    });
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
