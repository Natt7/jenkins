import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from '../index/index.component';
import {NotFoundComponent} from './not-found.component';
import {SliderbarComponent} from '../index/sliderbar.component';
import {TimeoutComponent} from '../index/timeout';
import {DetailComponent} from '../detail/detail.component';
import {CorrelationShopComponent} from '../correlation-shop/correlation-shop';
import {IndexSeekComponent} from '../index-seek/index-seek';
import {PurchaseComponent} from '../detail/purchase.component';
import {AddCartComponent} from '../detail/add-cart.component';
import {MineComponent} from '../mine/mine.component';
import {OrderComponent} from '../order/order.component';
import {RewardComponent} from '../reward/reward.component';
import {ReceiveComponent} from '../reward/receive.component';
import {DeliveryComponent} from '../delivery/delivery.component';
import {LeaveGuarddelivery} from '../delivery/unfocusGuarddelivery';
import {DeliverySuccesComponent} from '../delivery/delivery-success.component';
import {DeliverySuccesCargoComponent} from '../delivery/delivery-success-cargo.component';
import {CartComponent} from '../cart/cart.component';
import {NgModule} from '@angular/core';
import {ReceiveCouponComponent} from '../receive-coupon/receive-coupon';
import {CouponsComponent} from '../coupons/coupons';
import {StockComponent} from '../stock/stock';
import {OrderDetailComponent} from '../order-detail/order-detail';
import {LineItemComponent} from '../line-item/line-item';
import {CanActivateComponent} from './component-can-active';
import {PaySuccessComponent} from '../order/pay-success.component';
import {LeaveGuardpaydelivery} from '../order/unfocusGuardpaydelivery';
import {AuthLoginComponent} from '../login-auth/auth-login';
import {LoginComponent} from '../login/login.component';
import {ShareComponent} from '../share/share.component';
import {PaySuccessDeliveryComponent} from '../order/pay-success-delivery.component';
import {SuccessComponent} from '../order/success.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateComponent],
    children: [
      {path: 'not-found', component: NotFoundComponent},
      {path: 'auth-login', component: AuthLoginComponent},
      {path: 'login', component: LoginComponent},
      {path: 'share/:shopId', component: ShareComponent},
      {
        path: 'index/:shopId', component: IndexComponent,
        children: [
          {path: 'add/:shopId', component: SliderbarComponent},
          {path: 'add-cart/:shopId/:id', component: AddCartComponent},
        ]
      },
      {
        path: 'index/:shopId/:tagName', component: IndexComponent,
        children: [
          {path: 'add/:shopId', component: SliderbarComponent},
        ]
      },
      {path: 'index-seek/:shopId/:seek', component: IndexSeekComponent,
        children: [
          {path: 'add/:shopId', component: SliderbarComponent},
          {path: 'add-cart/:shopId/:id', component: AddCartComponent},
        ]
      },  
      {path: 'receive-coupon/:shopId', component: ReceiveCouponComponent},
      {path: 'timeout/:shopId', component: TimeoutComponent},
      {path: 'correlation-shop/:shopId/:id', component: CorrelationShopComponent},
      {
        path: 'detail/:shopId/:productId', component: DetailComponent, children: [
          {
            path: 'purchase/:shopId/:id', component: PurchaseComponent,
          },
          {path: 'add-cart/:shopId/:id', component: AddCartComponent},
        ]
      },
      {
        path: 'mine', component: MineComponent,
        children: [
          {path: 'order/:shopId/:active', component: OrderComponent},
          // {path: 'order', component: OrderComponent},
          {path: 'coupons/:shopId', component: CouponsComponent},
          {path: 'stock/:shopId', component: StockComponent},
        ]
      },
      {path: 'reward/:shopId/:id', component: RewardComponent},
      {path: 'order-detail/:shopId/:flag', component: OrderDetailComponent},
      // {path: 'order-detail', component: OrderDetailComponent},
      {path: 'line-item/:shopId/:code/:flag', component: LineItemComponent},
      {path: 'pay-success/:shopId/:code', component: PaySuccessComponent},
      {path: 'receive/:shopId/:id', component: ReceiveComponent},
      {path: 'pay-success-delivery/:shopId/:code', component: PaySuccessDeliveryComponent, canDeactivate: [LeaveGuardpaydelivery]},
      {path: 'delivery/:shopId', component: DeliveryComponent, canDeactivate: [LeaveGuarddelivery]},
      {path: 'delivery-success/:shopId/:id', component: DeliverySuccesComponent},
      {path: 'delivery-success-cargo/:shopId/:id', component: DeliverySuccesCargoComponent},
      {path: 'success/:shopId/:code', component: SuccessComponent},
      {
        path: 'cart/:shopId', component: CartComponent, children: [
          {path: 'add/:shopId', component: SliderbarComponent},
        ]
      },
      {path: '**', redirectTo: 'not-found'},
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LeaveGuarddelivery,LeaveGuardpaydelivery]
})
export class AppRoutingModule {

}

export const routedComponents = [
  CouponsComponent,
  StockComponent,
  IndexComponent,
  DetailComponent,
  SliderbarComponent,
  AddCartComponent,
  PurchaseComponent,
  MineComponent,
  OrderComponent,
  CorrelationShopComponent,
  OrderDetailComponent,
  CartComponent,
  RewardComponent,
  TimeoutComponent,
  DeliveryComponent,
  DeliverySuccesComponent,
  NotFoundComponent,
  ReceiveComponent,
  ReceiveCouponComponent,
  PaySuccessComponent,
  PaySuccessDeliveryComponent,
  SuccessComponent,
  DeliverySuccesCargoComponent,
  LineItemComponent,
  IndexSeekComponent,
  ShareComponent
];

