import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {HttpResponse} from '../models/HttpResponse';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {environment} from '../../environments/environment';

declare var wx: any;

@Injectable()
export class WechatService extends HttpService {
  jsSignBehavior: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  shareRedBin = false; //红包浮层显示 
  pdisShare = 0;  //是否分享：1=已分享、2=未分享

  getJsSign(merchantId) {
    return this.get(`shop/wechat/js-sign?referer=${encodeURIComponent(window.location.href)}`);
  }

  getPrepareId(orderNo: string) {
    return this.get(`shop/wechat/prepare-id?order_no=${orderNo}`);
  }

  statisticsShare(shopId: any, s: string) {
    const model = {
      shared: s,
      depth: 1,
      tempId: this.localStorage.getItem('tempId'),
    };
    return this.post(`shop/index/statistics?shop_id=${shopId}`, model);
  }

  initConfig() {
    const self = this;
    if (typeof(wx) !== 'undefined') {
      this.getJsSign(null)
        .subscribe(data => {
          wx.config(data.result);
          this.jsSignBehavior.next(true);
        });
    }
  }

  shareGetRed() {
    return this.get(`shop/index/send-packet`);
  }

  configShare(title, _desc, _link, _imgUrl, shopId: string = null, _pageName: string = null) {
    const self = this;
    wx.ready(function () {
      wx.hideMenuItems({
          menuList: ['menuItem:copyUrl'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
      });
      wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: _link, // 分享链接
        imgUrl: _imgUrl, // 分享图标
        success: function () {
          console.log("1")
        },
        cancel: function () {
          console.log("11")
        }

      });
      wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: _desc, // 分享描述
        link: _link, // 分享链接
        imgUrl: _imgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          console.log("2")
          // console.log(shopId)
          // console.log(_pageName)
          // alert(self.pdisShare)
          // if (self.pdisShare == 2) {  // 如果第一次分享 显示领红包浮层
          //   self.shareRedBin = true;
          //   self.pdisShare = 1
          // }

          if (shopId && _pageName) {
            self.statisticsShare(shopId, _pageName).subscribe(data => {
            });
          }
        },
        cancel: function () {
          console.log("22")
        }
      });

      wx.onMenuShareQQ({
        title: title, // 分享标题
        desc: _desc, // 分享描述
        link: _link, // 分享链接
        imgUrl: _imgUrl, // 分享图标
        success: function () {
          if (shopId && _pageName) {
            self.statisticsShare(shopId, _pageName).subscribe(data => {
            });
          }
        },
        cancel: function () {
        }
      });

      wx.onMenuShareWeibo({
        title: title, // 分享标题
        desc: _desc, // 分享描述
        link: _link, // 分享链接
        imgUrl: _imgUrl, // 分享图标
        success: function () {
          if (shopId && _pageName) {
            self.statisticsShare(shopId, _pageName).subscribe(data => {
            });
          }
        },
        cancel: function () {
        }
      });
    });

    
  }
}
