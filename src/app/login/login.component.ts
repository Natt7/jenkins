import {Component, CUSTOM_ELEMENTS_SCHEMA, HostBinding, Inject, NgModule, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {BaseComponent} from '../base.component';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {CommonModule, Location} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {slideInOutAnimation} from '../_animate';
import {UserService} from '../service/user.service';
import {UIService} from '../service/ui.service';
import {ActivatedRoute} from '@angular/router';
import {GlobalService} from '../service/global.service';
import {CouponService} from '../service/coupon.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  second = 0;
  mobile = '';
  captcha = '';
  // alert文字
  textAlert = '请输入正确格式'
  // 判断显示alert
  pdalert = false

  constructor(protected titleService: Title,
              public userService: UserService,
              private route: ActivatedRoute,
              private globalService: GlobalService,
              private UIService: UIService,
              private location: Location,
              public couponService: CouponService,
              @Inject('LOCALSTORAGE') private localStorage: any) {
  }

  sendCaptcha($event) {
    if (this.mobile === '') {
      this.pdalert = true
      this.textAlert = '请输入正确的手机号'
//      this.UIService.toast('请输入正确的手机号');
    } else {
      if (/^1[0-9]{10}$/.test(this.mobile)) {

        this.userService.sendCaptcha(this.mobile, this.globalService.shopModel.code).subscribe(data => {
          // console.log("请求验证码成功")
          console.log(data)
          if (data.result_code !== "10000") {
            this.pdalert = true
            this.textAlert = '验证码请求失败请重试' + data.result_code
          }
        });
        this.second = 60;
        const self = this;
        const countdown = setInterval(function () {
          self.second--;
          if (self.second < 0) {
            self.second = 0
          }
          if (self.second === 0) {
            clearInterval(countdown);
          }
        }, 1000)
      } else {
        this.pdalert = true
        this.textAlert = '请输入正确格式的手机号'
        //this.UIService.toast('请输入正确格式的手机号');
      }

    }
  }
  // alert消失
  qxalert(){
    this.pdalert = false
  }

  bindMobile() {
    if (this.mobile.trim() === '') {
  //    this.UIService.toast('请输入手机号');
      this.textAlert = '请输入正确的手机号'
      this.pdalert = true
    } else if (this.mobile.trim() === '') {
      this.textAlert = '请输入验证码'
      this.pdalert = true
  //    this.UIService.toast('请输入验证码');
    } else {
      this.userService.bindMobile(this.mobile, this.captcha, this.globalService.shopModel.code).subscribe(data => {
        if (data.result_code === '10000') {
          if(this.couponService.pdlogsubscribe === true) {  // 判断是否要订阅
            console.log(this.couponService.kolid)
            this.userService.subscribe(this.couponService.kolid).subscribe(s => {
              console.log(s)
              this.couponService.pdlogsubscribe = false
              this.couponService.pdxssubscribe = true  //  判断显示为true
              this.couponService.pdsubscribe = true
            });
          }

          this.userService.identity.mobile = this.mobile;
          this.localStorage.setItem('wechat_access_token', data.result.access_token);
          this.globalService.statisticsRegister(this.globalService.shopModel.code, '登录页面').subscribe(d => {});
          this.userService.profile(data.result.access_token).subscribe(p => {
            Object.assign(this.userService.identity, p.result);
            this.userService.judgeUserMobile();
            this.userService.loginSuccess.next(true);
            this.location.back();
          });

        } else {
        //  this.UIService.toast(data.reason);
          this.pdalert = true
          this.textAlert = data.reason
        }
      });
    }

  }

  get showSend() {
    return this.second === 0;
  }

}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
  ],
  exports: [LoginComponent],
  declarations: [
    LoginComponent,
  ],
  providers: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LoginModule {
}
