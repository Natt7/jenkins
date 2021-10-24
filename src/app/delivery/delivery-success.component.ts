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
import {WechatService} from '../service/wechat.service';
import {environment} from '../../environments/environment';
import {UserService} from '../service/user.service';

@Component({
  templateUrl: './delivery-success.component.html',
  styleUrls: ['./delivery-success.component.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class DeliverySuccesComponent implements OnInit {
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
  deliveryId: any;
  needAddress = false;

  shop_code = ''
  remark: any = '' // 备注

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected apiService: ApiService,
              protected globalService: GlobalService,
              protected titleService: Title,
              public userService: UserService,
              public wechatService: WechatService) {

  }

  ngOnInit(): void {
    const thisthis = this
    // setInterval(function(){
    //   console.log(thisthis.wechatService.shareRedBin)
    // },1000)
    Observable.from(this.route.params)
      .subscribe(params => {
        this.shopId = params.shopId;
        this.globalService.initShopInfo(this.shopId);
        this.globalService.statisticsPage(this.shopId, '发货成功').subscribe(data => {});

        this.deliveryId = params.id;

        // this.userService.user().subscribe(data => { // 获取是否分享
        //   console.log(data.result)
        //   this.wechatService.pdisShare = data.result.profile.is_shared
        //   console.log(this.wechatService.pdisShare)
        //   console.log(this.wechatService.shareRedBin)
        //   console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa")

        // });



      const combine: Observable<any> = this.wechatService.jsSignBehavior.combineLatest(this.globalService.shopInfoBehavior, (x, y) => {
        if (x && y !== null) {
          return y;
        } else {
          return false;
        }
      });
      combine.subscribe(data => {
        console.log(data)
        if (data) {

          var url = `${environment.page_host}/#/index/${this.shopId}`;
          this.wechatService.configShare(data.title, data.description, url, data.thumb, this.shopId, '首页');
        }
      });





        this.orderService.successDelivery(this.deliveryId).subscribe(res => {
          console.log(res)
          this.addressId = res.result.address_id;
          this.shop_code = res.result.shop_code
          this.remark = res.result.message
          this.delivery = res.result;
          this.delivery.products.forEach(product => {
            if (product.product.products_type === '实体') {
              this.needAddress = true;
            }
          });
          this.orderService.getAddress(this.addressId).subscribe(r => {
            this.address = r.result;
          });
        });
      })
  }
  goIndex() {
    console.log(environment.page_host)
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
