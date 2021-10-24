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
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalService} from '../service/global.service';
import {CouponService} from '../service/coupon.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
})
export class ShareComponent {

  shopId: any;
  pdgoMain = false

  constructor(protected titleService: Title,
              public userService: UserService,
              protected router: Router,
              private route: ActivatedRoute,
              private globalService: GlobalService,
              private UIService: UIService,
              private location: Location,
              public couponService: CouponService,
              @Inject('LOCALSTORAGE') private localStorage: any) {
      console.log("11111111111")
      this.route.params.subscribe(params => {
        console.log(params)
        this.shopId = params.shopId;
      })
  }
  shardBut() {
    this.pdgoMain = true
  }
  goIndex() {
    this.router.navigate(['index', this.shopId]);
  }


}

// @NgModule({
//   imports: [
//     CommonModule,
//     HttpClientModule,
//     FormsModule,
//   ],
//   exports: [ShareComponent],
//   declarations: [
//     ShareComponent,
//   ],
//   providers: [],
//   schemas: [
//     CUSTOM_ELEMENTS_SCHEMA
//   ]
// })
// export class ShareModule {
// }
