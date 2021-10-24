import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../service/order.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {UserService} from '../service/user.service';
import {GlobalService} from '../service/global.service';
import {MineService} from '../service/mine.service';


@Component({
  templateUrl: './mine.component.html',
  styleUrls: ['./mine.component.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class MineComponent implements OnInit {
  title = '产品列表';
  shopId;
  stockCount = 0;

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected apiService: ApiService,
              protected globalService: GlobalService,
              protected titleService: Title,
              public mineService: MineService,
              public userService: UserService) {

  }

  ngOnInit(): void {
    Observable.from(this.route.firstChild.params)
      .subscribe(params => {
        this.shopId = params.shopId;
        this.globalService.initShopInfo(this.shopId);

        this.globalService.statisticsPage(this.shopId, '我的页面').subscribe(data => {});

        this.orderService.getStockCount().subscribe(res => {
          this.stockCount = res.result.count
        })
      })
  }
}
