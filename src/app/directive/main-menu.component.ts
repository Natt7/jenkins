import {Component, ViewEncapsulation, HostBinding, OnInit, OnDestroy, Input} from '@angular/core';
import {ApiService} from '../service/api.service';
import {BaseComponent} from '../base.component';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {CartService} from '../service/cart.service';
import {UserService} from '../service/user.service';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
})
export class MainMenuComponent implements OnInit, OnDestroy {
  title = '产品列表';

  @Input() shopId;

  cartCount = 0;
  subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.cartService.getCartCountObservable().subscribe(message => {
      this.cartCount = message
    });
    this.cartService.updateCartCount(this.shopId);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(protected apiService: ApiService,
              protected router: Router,
              protected route: ActivatedRoute,
              protected titleService: Title,
              protected userService: UserService,
              protected cartService: CartService) {

  }

  backClicked() {
    this.router.navigate(['^'])
  }

  goMine() {
    if (this.userService.judgeUserMobile()) {
      this.router.navigate(['/mine/order', this.shopId, 'order']);
    }
  }
  goCart() {
    if (this.userService.judgeLogin()) {
      this.router.navigate(['/cart', this.shopId]);
    }
  }

  goMore() {
    localStorage.setItem("frontendhistory","false"); //禁止更多返回首页时跳转
    // this.router.navigate(['add', this.shopId]);
  }
}
