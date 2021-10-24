import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {MomentModule} from 'angular2-moment';
import { QRCodeModule } from 'angular2-qrcode';

import {AppComponent} from './bootstrap/app.component';
import {BaseComponent} from './base.component';
import {MainMenuComponent} from './directive/index';
import {ProductService} from './service/product.service';
import {CartService} from './service/cart.service';
import {OrderService} from './service/order.service';
import {AppRoutingModule, routedComponents} from './bootstrap/routes';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ApiService} from './service/api.service';
import {IndexComponent} from './index/index.component';
import {CouponService} from './service/coupon.service';
import {ChooseCouponModule} from './choose-coupon/choose-coupon';
import {MineService} from './service/mine.service';
import {PaymentModule} from './cart/payment.component';
import {UIService} from './service/ui.service';
import {WechatService} from './service/wechat.service';
import {BannerService} from './service/banner.service';
import {CanActivateComponent} from './bootstrap/component-can-active';
import {GlobalService} from './service/global.service';
import {UserService} from './service/user.service';
import {LoginModule} from './login/login.component';
// import {ShareModule} from './share/share.component';
import { NgxCarouselModule } from 'ngx-carousel';
import {SelectAddressComponent, SelectAddressModule} from './address/select-address';
import {AddressService} from 'app/service/address.service';
import {RewardService} from './service/reward.service';
import {AuthLoginModule} from './login-auth/auth-login';
import {ClipboardModule} from 'ngx-clipboard/dist';
import { HtmlPipe } from './detail/innerhtmlpipe';

const INITIAL_COMPONENTS = [routedComponents, MainMenuComponent, AppComponent, BaseComponent, IndexComponent, HtmlPipe];

@NgModule({
  imports: [
    MomentModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChooseCouponModule,
    PaymentModule,
    LoginModule,
    // ShareModule,
    AuthLoginModule,
    SelectAddressModule,
    NgxCarouselModule,
    ClipboardModule,
    QRCodeModule,
  ],
  providers: [
    GlobalService,
    CanActivateComponent,
    ApiService,
    ProductService,
    CartService,
    OrderService,
    MineService,
    CouponService,
    BannerService,
    UIService,
    WechatService,
    UserService,
    AddressService,
    RewardService,
    {
      provide: LocationStrategy, useClass: HashLocationStrategy,
    },
    { provide: 'LOCALSTORAGE', useFactory: getLocalStorage }
  ],
  declarations: INITIAL_COMPONENTS,
  schemas: [SelectAddressComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
}

export function getLocalStorage() {
  return (typeof window !== 'undefined') ? window.localStorage : null;
}
