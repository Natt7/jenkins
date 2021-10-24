import {UserModel} from '../models/UserModel';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {HttpResponse} from '../models/HttpResponse';
import {Injectable} from '@angular/core';
import {HttpService} from './http.service';

@Injectable()
export class UserService extends HttpService {

  identity: UserModel = new UserModel();
  showLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loginSuccess: Subject<boolean> = new Subject<boolean>();
  userBehavior: Subject<UserModel> = new Subject<UserModel>();

  pdregistered = false    // 判断是否注册
  // 首页活动浮层
  pdzhognqiu = false

  get isBindMobile(): boolean {
    return this.identity.mobile && this.identity.mobile !== '';
  }

  get isGuest(): boolean {
    return !this.identity.id;
  }

  judgeUserMobile(): boolean {
    if (!this.isBindMobile) {
      this.showLogin.next(true);
      return false;
    } else {
      this.showLogin.next(false);
      return true;
    }
  }

  judgeLogin(): boolean {
    if (!this.identity.id) {
      this.showLogin.next(true);
      return false;
    } else {
      this.showLogin.next(false);
      return true;
    }
  }

  initUserProfile() {
    const item = this.localStorage.getItem('wechat_access_token');
    if (item) {
      this.profile(item).subscribe(data => {
        // console.log("sssssssssssssssssss")
        // console.log(item)
        // console.log(data)
        // console.log("sssssssssssssssssss")
        if (data.result.mobile === "") {   // 判断是否注册
          this.pdregistered = false
        } else {
          this.pdregistered = true
        }

        this.identity = Object.assign(new UserModel(), data.result);
        this.userBehavior.next(this.identity);
      });
    }
  }

  sendCaptcha(mobile: string, shopId: string = null): Observable<HttpResponse> {
    return this.post(`shop/user/captcha`, {mobile: mobile, shop_id: shopId});
  }

  bindMobile(mobile: string, captcha: string, shop_id: any): Observable<HttpResponse> {
    return this.post(`shop/user/bind-mobile`, {
      mobile: mobile,
      captcha: captcha,
      shop_id: shop_id
    });
  }

  validateAccessToken(accessToken: any): Observable<HttpResponse> {
    return this.get(`shop/user/validate-access-token?access_token=${accessToken}`);
  }

  profile(accessToken: any) {
    return this.get(`shop/user/profile?access_token=${accessToken}`);
  }

  subscribe(channel_id: number) {
    return this.get(`shop/index/subscribe?channel_id=${channel_id}`);
  }
  user() {
    return this.post(`shop/index/user`);
  }
  takered(url: any) {
    return this.post(`shop/index/send-packet`, {redirect_uri: url});
  }
  // KOL相关商城
  corrslationShop(page: any, pageSize: any, channel_id: any, type: any): Observable<any> {
    return this.post(`shop/index/channel-shop?page=${page}&pageSize=${pageSize}&channel_id=${channel_id}&type=${type}`);
  }
}
