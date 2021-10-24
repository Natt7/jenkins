import {Component, OnInit, Renderer, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../service/order.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {UIService} from '../service/ui.service';
import {RewardService} from '../service/reward.service';
import {RewardModel} from '../models/RewardModel';
import {WechatService} from '../service/wechat.service';
import {environment} from '../../environments/environment';
import {GlobalService} from '../service/global.service';
import {ClipboardService} from 'ngx-clipboard/dist';

@Component({
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class RewardComponent implements OnInit {
  // alert文字
  textAlert = '请输入正确格式'
  pdalert = false

  rewardId: any;
  rewardCode: string;
  shopId: any;
  isShowTip = false;
  isShowCopy = false;
  title = '产品列表';
  reward = new RewardModel();

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              protected apiService: ApiService,
              protected titleService: Title,
              protected rewardService: RewardService,
              protected wechatService: WechatService,
              protected globalService: GlobalService,
              protected clipboardService: ClipboardService,
              private renderer: Renderer,
              protected UIService: UIService) {
  }

  ngOnInit(): void {
    Observable.from(this.route.params)
      .subscribe(params => {
        this.shopId = params.shopId;
        this.globalService.initShopInfo(this.shopId);
        this.globalService.statisticsPage(this.shopId, '赠送页面').subscribe(data => {
        });

        this.rewardId = params.id;

        this.rewardService.getReward(this.rewardId).subscribe(r => {
          this.rewardCode = r.result.code;
          this.reward = r.result;

          const url = `${environment.page_host}/#/receive/${this.shopId}/${this.rewardCode}`;
          this.wechatService.configShare(` 您的好友${this.reward.user.profile.nickname}赠送您一份礼包`,
            this.reward.content,
            url,
            `http://dudu.imnumerique.com/images/reward.png`,
            this.shopId, '赠送页面');
        });
      })
  }

  // alert消失
  qxalert(){
    this.pdalert = false
  }

  doReward() {
    if (!this.reward.content || this.reward.content.trim().length <= 0) {
      //this.UIService.toast('请输入留言');
      this.pdalert = true
      this.textAlert = '请输入留言'
      return false;
    } else {
      if (this.globalService.isWechat()) {
        this.isShowTip = true;
      } else {
        const url = `${environment.page_host}/#/receive/${this.shopId}/${this.rewardCode}`;
        this.clipboardService.copyFromContent(`我在${this.globalService.shopModel.shop_name}买了礼物给你，快打开来看看吧(^▽^)！${url}`, this.renderer);
        this.isShowCopy = true;
      }
      this.rewardService.doReward({
        id: this.rewardId,
        content: this.reward.content,
      }).subscribe(res => {
      })
    }
  }

  showTip() {
    if (this.globalService.isWechat()) {
      this.isShowTip = true;
    } else {
      const url = `${environment.page_host}/#/receive/${this.shopId}/${this.rewardCode}`;
      this.clipboardService.copyFromContent(`我在${this.globalService.shopModel.shop_name}买了礼物给你，快打开来看看吧(^▽^)！${url}`, this.renderer);
      this.isShowCopy = true;
    }
  }

  hideTip() {
    this.isShowTip = false;
  }

  hideCopy() {
    this.isShowCopy = false;
  }

  goIndex() {
    this.router.navigate(['index', this.shopId])
  }

  goCart() {
    this.router.navigate(['cart', this.shopId])
  }
}
