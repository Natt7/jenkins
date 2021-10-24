import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../service/order.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {GlobalService} from '../service/global.service';
import {DeliveryModel} from '../models/DeliveryModel';
import {environment} from '../../environments/environment';
import {WechatService} from '../service/wechat.service';
import {UserService} from '../service/user.service';

@Component({
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class SuccessComponent implements OnInit {
  address = {
    id: null,
    name: '',
    mobile: '',
    region: '',
    address: '',
    region_desc: '',
  };
  delivery = new DeliveryModel();
  // delivery = {
  //   address_id: null,
  //   products: []
  // };
  addressId: any;
  title = '产品列表';
  shopId: any;
  code: any;
  shop_code = ''
  remark: any = '' // 备注

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected apiService: ApiService,
              protected globalService: GlobalService,
              public userService: UserService,
              public wechatService: WechatService,
              protected titleService: Title) {

  }

  ngOnInit(): void {
    const thisthisthis = this
    // setInterval(function(){
    //   console.log(thisthisthis.wechatService.shareRedBin)
    // },1000)
    Observable.from(this.route.params)
      .subscribe(params => {

        this.shopId = params.shopId;
        this.globalService.initShopInfo(this.shopId);
        this.globalService.statisticsPage(this.shopId, '发货成功').subscribe(data => {});
        this.code = params.code;
        // this.orderService.getOrder(this.code).subscribe(res => {
        //    console.log(res);
        // });
        // this.userService.user().subscribe(data => { // 获取是否分享
        //   console.log(data.result)
        //   this.wechatService.pdisShare = data.result.profile.is_shared
        //   console.log(this.wechatService.pdisShare)
        //   console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa")
        // });

        this.orderService.successDelivery(this.code).subscribe(res => {
          //this.addressId = res.result.address_id;
          this.shop_code = res.result.shop_code
          this.remark = res.result.message
          this.delivery = res.result;
          // this.orderService.getAddress(this.addressId).subscribe(r => {
          //   this.address = r.result;
          // });
        });
      })
  }
  goIndex() {
    this.orderService.pdJumpIndex = true  //回到首页或商品详情页需要刷新
    this.router.navigate(['index', this.shop_code]);

    // window.location.href = `${environment.page_host}#/index/${this.shop_code}`;
  }
  jump(product) {
    console.log(product)
    this.orderService.pdJumpIndex = true  //回到首页或商品详情页需要刷新
    this.router.navigate(['detail', this.shop_code, product.product.id]);
    // window.location.href = `${environment.page_host}#/detail/${this.shop_code}/${product.product.id}`;
  }
    takered() {
    var url = `http://static.imnumerique.com/dudustatic/index.html?shopid=${this.shopId}`;
    this.userService.takered(url).subscribe(data => { // 获取是否分享
      console.log(data)
      if (data.result_code === "10000") {
        console.log("领取成功")
        window.location.href = data.result.url
      } else {
        alert(data.reason)
      }
    });
  }
}
