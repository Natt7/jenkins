import {Component, OnInit, Inject} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../service/order.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {UIService} from '../service/ui.service';
import {RewardService} from '../service/reward.service';
import {GlobalService} from '../service/global.service';
import {MineService} from '../service/mine.service';


@Component({
  templateUrl: './stock.html',
  styleUrls: ['./stock.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class StockComponent implements OnInit {
  // alert文字
  textAlert = '请输入正确格式'
  pdalert = false

  friendparams = []
  meparams = []

  title = '产品列表';
  shopId;
  stockCount = 0;
  units = {};
  shows = {};
  isChoose = {};
  maxes = {};
  products: Array<any> = [];
  // 判断显示alert
  pdalertFriend = false;
  pdalertMe = false;
  stockInfo = [];



  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected apiService: ApiService,
              protected titleService: Title,
              protected rewardService: RewardService,
              protected globalService: GlobalService,
              public mineService: MineService,
              protected UIService: UIService,
              @Inject('LOCALSTORAGE') protected localStorage: any) {

  }

  ngOnInit(): void {
    this.mineService.pdorderimg = false
    this.mineService.pdstockimg = true
    this.mineService.pdcouponsimg = false
    Observable.from(this.route.params)
      .subscribe(params => {
        this.shopId = params.shopId;
        this.globalService.initShopInfo(this.shopId);
        this.globalService.statisticsPage(this.shopId, '我的库存').subscribe(data => {});

        this.orderService.getStocks().subscribe(res => {

          this.products = res.result;
          for (const product of this.products) {
            this.units[product.product_id] = 0;
            this.shows[product.product_id] = false;
            this.isChoose[product.product_id] = false;
            this.maxes[product.product_id] = parseInt(product.amount, 10);
          }
          console.log(this.products)
        });

        this.orderService.getStockCount().subscribe(res => {
          this.stockCount = res.result.count
        })
      });
  }

  // alert消失
  qxalert(){
    this.pdalert = false
  }

  showSelect(product_id) {
    if (this.shows[product_id]) {
      this.shows[product_id] = false;
      this.units[product_id] = 0;
    } else {
      this.shows[product_id] = true;
      this.units[product_id] = 1;
    }
  }

  confirm(product) {
    this.shows[product.product_id] = false;
    if (this.units[product.product_id] === 0) {
      this.isChoose[product.product_id] = false;
    } else {
      this.isChoose[product.product_id] = true;
    }
  }

  plusUnit(product_id) {
    this.units[product_id]++;
    console.log(this.units)
    if (this.units[product_id] >= this.maxes[product_id]) {
      this.units[product_id] = this.maxes[product_id];
    }
  }

  minusUnit(product_id) {
    this.units[product_id]--;
    if (this.units[product_id] <= 0) {
      this.units[product_id] = 0;
    }
  }
  deleteUnit(product_id) {
     this.isChoose[product_id] = false;
     this.units[product_id] = 0;
  }

  qxfriendAlert(){
    this.pdalertFriend = false
    this.friendparams = []
  }

  qxmeAlert(){
    this.pdalertMe = false
    this.meparams = []
  }

  reward() {  // 好友
    this.pdalertFriend = false
    const params = [];
    let u = 0;
    Object.keys(this.units).forEach(key => {
      this.friendparams.push({
        i: key,
        u: this.units[key]
      });
      u += this.units[key];
    });
    if (u <= 0) {
      //this.UIService.toast('请选择库存');
      this.pdalert = true
      this.textAlert = '请选择库存'
      return false;
    } else {
      this.pdalertFriend = true
    }

  }
  friendAlert() {
    this.pdalertFriend = false
    this.rewardService.reward({
      ids: this.friendparams
    }).subscribe(res => {
      if (res.result_code === '10000') {
        this.router.navigate(['reward', this.shopId, res.result.id])
      }
    });
  }



  delivery() {  // 自己
    this.pdalertMe = false
    const params = [];
    let u = 0;
    Object.keys(this.units).forEach(key => {
      this.meparams.push({
        i: parseInt(key),
        u: this.units[key]
      });
      u += this.units[key];
    });
    // Object.keys(this.units).forEach(key => {
    //   this.products.forEach(product => {
    //     if (key === product.product_id) {
    //       product.amount = this.units[key];
    //       this.orderService.productBehavior.push(product);
    //     }
    //   });
    //   // Object.keys(this.products).forEach( productKey => {
    //   //   if ( key === this.products[productKey].product_id) {
    //   //     this.orderService.productBehavior[productKey].amount = this.units[key];
    //   //   }
    //   // this.orderService.productBehavior.forEach( product => {
    //   //      if ( key === product.product_id) {
    //   //          product.amount = this.units[key];
    //   //      }
    //   // })
    //   u += this.units[key];
    // });
    if (u <= 0) {
      //this.UIService.toast('请选择库存');
      this.pdalert = true
      this.textAlert = '请选择库存'
      return false;
    } else {
      this.pdalertMe = true
    }
  }
  meAlert() {
    console.log(this.meparams)
    this.meparams.forEach(data => {
      this.products.forEach(product => {
        if (data.i === product.product_id && data.u > 0) {
          product.amount = data.u;
          this.stockInfo.push(product);
        }
      })
    });
    console.log(this.stockInfo)
    this.localStorage.setItem('stockProducts', JSON.stringify(this.stockInfo));
    // console.log(this.meparams);
    // console.log(this.products);
    // console.log(this.orderService.productBehavior);
    // console.log(1111);
    this.router.navigate(['delivery', this.shopId]);
    // this.orderService.delivery({
    //   ids: this.meparams
    // }).subscribe(res => {
    //   if (res.result_code === '10000') {
    //     this.router.navigate(['delivery', this.shopId, res.result.id])
    //   }
    // });
  }

  goOrder() {
    this.router.navigate(['order', this.shopId, 'order'])
  }

  goIndex() {
    this.router.navigate(['index', this.shopId])
  }
}
