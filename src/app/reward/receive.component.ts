import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../service/order.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {RewardService} from '../service/reward.service';
import {RewardModel} from '../models/RewardModel';
import {UIService} from '../service/ui.service';
import {GlobalService} from '../service/global.service';
import {UserService} from '../service/user.service';

@Component({
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class ReceiveComponent implements OnInit {
  // alert文字
  textAlert = '请输入正确格式'
  pdalert = false

  rewardId: any;
  shopId: any;
  content = '';
  title = '产品列表';
  reward = new RewardModel();

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected apiService: ApiService,
              protected rewardService: RewardService,
              protected globalService: GlobalService,
              protected userService: UserService,
              protected titleService: Title,
              protected uiService: UIService) {

  }

  ngOnInit(): void {
    Observable.from(this.route.params)
      .subscribe(params => {
        this.shopId = params.shopId;
        this.globalService.initShopInfo(this.shopId);
        this.globalService.statisticsPage(this.shopId, '领取商品').subscribe(data => {});
        this.rewardService.getRewardByCode(params.id).subscribe(res => {
          this.reward = res.result;
          this.rewardId = res.result.id;
        });
      })
  }

  // alert消失
  qxalert(){
    this.pdalert = false
  }

  receive() {
    if (this.userService.judgeUserMobile()) {
      this.rewardService.receive(this.rewardId).subscribe(res => {
        if (res.result_code === '10000') {
          this.router.navigate(['/mine/stock', this.shopId])
        } else {
          //this.uiService.toast(res.reason);
          this.pdalert = true
          this.textAlert = res.reason
        }
      });
    }
  }
}
