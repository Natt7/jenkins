import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {BaseComponent} from '../base.component';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {CartService} from '../service/cart.service';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {CartEntity} from '../models/CartEntity';
import {UserService} from '../service/user.service';
import {GlobalService} from '../service/global.service';
import {ProductService} from '../service/product.service';
import {OrderService} from '../service/order.service';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class CartComponent implements OnInit, OnDestroy {
  title = '购物车';

  subscription: Subscription;
  carts: CartEntity[] = [];

  productCount = 0;
  totalPrice = 0;

  shopId: string;
  plusing = false;
  minusing = false;
  // 删除的商品id
  deleteproductid = ''
  pdalert = false

  pdcarts = true
  brands: Array<any>;
  shop_type: number;
  paramsshopId = ''
  paramstagName = ''

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected cartService: CartService,
              protected productService: ProductService,
              protected apiService: ApiService,
              protected userService: UserService,
              protected globalService: GlobalService,
              protected orderService: OrderService,
              protected titleService: Title) {
    this.route.params.subscribe(params => {
      this.paramsshopId = params.shopId
      this.paramstagName = params.tagName
    })

  }
  ngOnInit(): void {
    this.initCart();
  }
  private initCart() {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    this.subscription = this.cartService.getCarts().subscribe(message => {
      this.carts = [];
      Object.assign(this.carts, message);
      this.productCount = 0;
      this.totalPrice = 0;
      for (const cart of this.carts) {
        for (const product of cart.products) {
          this.productCount += product.unit;
          this.totalPrice += product.unit * product.product.price;
        }
      }
      // 判断购物车是否有商品
      if (this.carts.length > 0) {
        this.pdcarts = true

      } else {
        this.pdcarts = false

        this.productService.getProducts(this.paramsshopId, this.paramstagName, '').subscribe(data => {
          this.brands = data.result;
          console.log("!!!!!!!!!!!!!!!!")
          console.log(this.brands)
          this.shop_type = this.globalService.shopModel.project_type;
        });

      }

    });
    Observable.from(this.route.params)
      .subscribe(params => {
        this.shopId = params.shopId;
        this.globalService.initShopInfo(this.shopId);
        this.globalService.statisticsPage(this.shopId, '购物车').subscribe(data => {
        });
        this.cartService.updateCarts(this.shopId);
      })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
    // alert消失
  qxAlert() {
    this.pdalert = false
  }

  minus(i, j) {
    if (this.minusing) {
      return false;
    } else {
      this.minusing = true;
      if (this.carts[i].products[j].unit <= 1) {
        this.minusing = false;
        return false;
      } else {
        this.carts[i].products[j].unit--;
        this.cartService.minusUnit(this.carts[i].products[j].id).subscribe(res => {
          this.cartService.sendCarts(this.carts);
          this.minusing = false;
        });
      }
    }
  }

  plus(i, j) {
    if (this.plusing) {
      return false;
    } else {
      this.plusing = true;
      this.carts[i].products[j].unit++;
      this.cartService.plusUnit(this.carts[i].products[j].id).subscribe(res => {
        this.cartService.sendCarts(this.carts);
        this.plusing = false;
      });
    }
  }

  deleteProduct(i) {
    this.deleteproductid = i
    // console.log(this.deleteproductid)
    this.pdalert = true;
  }

  qrAlert() {
    this.cartService.deleteProduct(this.shopId, this.deleteproductid).subscribe(res => {
      this.cartService.updateCarts(this.shopId);
      this.initCart();
      this.pdalert = false
    })
  }
  createOrder() {
    if (this.userService.judgeUserMobile()) {

      // console.log(this.carts)

      // this.cartService.createOrder(this.shopId, this.globalService.isWechat() ? 'WECHAT' : 'WAP').subscribe(res => {
      //   if (res.result_code === '10000') {
          // this.router.navigate(['order-detail', this.shopId, 0]);
      //   } else {
      //   }
      // });
      this.orderService.productObject = []
      
      for (var a = 0; a < this.carts.length; a++){
        for (var i = 0; i < this.carts[a].products.length; i++) {
          if (this.carts[a].products[i].unit > 0) {
            this.orderService.productObject.push({
              unit: this.carts[a].products[i].unit,
              product: this.carts[a].products[i].product,
              attribute: this.carts[a].products[i].product_attributes
            })
          }
        }

      }
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      // console.log(this.orderService.productObject)
      this.orderService.pdInMode = "购物车"

      localStorage.setItem('dudushopId',this.shopId);
      localStorage.setItem('pdInMode','购物车');
      localStorage.setItem('productObject',JSON.stringify(this.orderService.productObject));
      this.router.navigate(['order-detail', this.shopId, 0]);
      // localStorage.setItem('dudushopId',this.shopId);
      // this.router.navigate(['order-detail'])

    }
  }
  goDetail(product) {
    this.router.navigate(['detail', this.shopId, product.id]);
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
  // 两位小数
  toDecimal2(x) {    
      var f = parseFloat(x);    
      if (isNaN(f)) {    
          return false;    
      }    
      var f = Math.round(x*100)/100;    
      var s = f.toString();    
      var rs = s.indexOf('.');    
      if (rs < 0) {    
          rs = s.length;    
          s += '.';    
      }    
      while (s.length <= rs + 2) {    
          s += '0';    
      }    
      return s;    
  }    
}
