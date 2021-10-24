import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../service/order.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {GlobalService} from '../service/global.service';

@Component({
  templateUrl: './pay-success.component.html',
  styleUrls: ['./pay-success.component.css'],
  providers: [ApiService],
})
export class PaySuccessComponent implements OnInit {
  order: any;
  shopId: any;
  code: any;

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected apiService: ApiService,
              protected globalService: GlobalService,
              protected titleService: Title) {

  }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.shopId = params.shopId;
        this.globalService.initShopInfo(this.shopId);
        this.globalService.statisticsPage(this.shopId, '支付成功').subscribe(data => {
        });
        this.orderService.getOrder(params.code).subscribe(res => {
          this.order = res.result;
          this.code = this.order.code;
        });
      })
  }

  //新增加的功能，购买成功之后点击发货直接跳至选择地址页
  ship() {
    this.router.navigate(['pay-success-delivery', this.shopId, this.code])
  }
}
