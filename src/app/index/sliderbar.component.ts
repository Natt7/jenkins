import {Component, ViewEncapsulation, HostBinding, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Title} from '@angular/platform-browser';
import {slideInOutAnimation} from './../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {UserService} from '../service/user.service';
import {GlobalService} from '../service/global.service';
import {OrderService} from '../service/order.service';
import {ProductService} from '../service/product.service';
@Component({
  moduleId: module.id.toString(),
  templateUrl: './sliderbar.component.html',
  styleUrls: ['./sliderbar.component.css'],
  animations: [slideInOutAnimation()],
})
export class SliderbarComponent implements OnInit {
  title = '产品列表';
  stockCount = 0;
  shopId: string;
  @HostBinding('@slideInOutAnimation') slideInOutAnimation;
  tags: any[];
  constructor(protected apiService: ApiService,
              protected router: Router,
              protected route: ActivatedRoute,
              protected titleService: Title,
              protected location: Location,
              public userService: UserService,
              public orderService: OrderService,
              public productService: ProductService,
              public globalService: GlobalService) {
    this.route.params.subscribe(params => {
      this.shopId = params.shopId;
      this.globalService.initShopInfo(this.shopId);
    });
  }
  ngOnInit(): void {
    this.orderService.getStockCount().subscribe(res => {
      this.stockCount = res.result.count ? res.result.count : 0;
    });
    this.productService.getShopProductTags(this.globalService.shopModel.code).subscribe(data => {
      this.tags = data.result;
    });
  }
  backClicked() {
    this.location.back();
  }
  goMine() {
    if (this.userService.judgeUserMobile()) {
      this.router.navigate(['/mine/order', this.shopId, 'order']);
      // this.router.navigate(['/mine/stock', this.globalService.shopModel.code]);
    }
  }
  getProduct(tag = null) {
    if (tag) {
      this.router.navigate(['index', this.shopId, tag.name ]);
    }else {
      this.router.navigate(['index', this.shopId]);
    }
  }
}
