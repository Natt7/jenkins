import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {ApiService} from '../service/api.service';
import {slideInOutBottomAnimation} from '../_animate/slide-in-out-bottom.animation';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../service/product.service';
import {CartService} from '../service/cart.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {ProductModel} from '../models/ProductModel';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {GlobalService} from '../service/global.service';
import {UserService} from '../service/user.service';
import {OrderService} from '../service/order.service';


@Component({
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
  providers: [ApiService],
  animations: [slideInOutBottomAnimation],
})
export class PurchaseComponent {
  unit = 1;
  product: ProductModel;
  shopId: string;
  attributes: any[] = [];
  attribute: string = '';
  pdalert = false;

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected productService: ProductService,
              protected orderService: OrderService,
              protected cartService: CartService,
              protected apiService: ApiService,
              protected globalService: GlobalService,
              protected userService: UserService,
              protected location: Location) {

    Observable.from(this.route.params)
      .subscribe(params => {
        setTimeout(function() {
          console.log(document.getElementById("add-cart-main"))
          document.getElementById("add-cart-main").style.bottom = "0"
        }, 200)
        this.shopId = params.shopId;
        this.globalService.initShopInfo(this.shopId);

        this.globalService.statisticsPage(this.shopId, '购买页面').subscribe(data => {
        });

        this.cartService.updateCartCount(this.shopId);
        productService.getProduct(params.id, params.shopId).subscribe(res => {
          this.product = res.result;
          console.log(this.product)
          if (this.product.attributes !== null) {
            for (var i = 0; i < this.product.attributes.length; i++) {
              this.attributes.push({"name": this.product.attributes[i], "selected": false})
            }
            console.log(this.attributes)
          }

        });
      });
  }

  back() {
    document.getElementById("add-cart-main").style.bottom = "-500px"
    const that = this
    setTimeout(function() {
      that.location.back();
    }, 500)
  }

  minusUnit() {
    this.unit--;
    if (this.unit <= 1) {
      this.unit = 1;
    }
  }

  plusUnit() {
    this.unit++;
  }
  qxalert() {
    this.pdalert = false;
  }
  goPurchase() {
    if (this.attributes.length > 0 && this.attribute === '') {
      this.pdalert = true;

    } else {

      this.orderService.productObject = []

      this.orderService.productObject.push({
        unit: this.unit,
        product: this.product,
        attribute: this.attribute
      })
      // this.orderService.productObject.push({
      //   unit: this.unit,
      //   product: this.product
      // })
      // this.orderService.productObject.push({
      //   unit: this.unit,
      //   product: this.product
      // })


      console.log(this.orderService.productObject)
  
      if (this.userService.judgeUserMobile()) {
        // this.cartService.directCreateOrder(this.shopId, this.product.id, this.unit,
        //   this.globalService.isWechat() ? 'WECHAT' : 'WAP').subscribe(data => {
        //   this.router.navigate(['order-detail', this.shopId, data.result.code, 0]);
        // });
        this.orderService.pdInMode = "单品"
        
        // this.orderService.shopId = this.shopId
        localStorage.setItem('dudushopId',this.shopId);
        localStorage.setItem('pdInMode','单品');
        localStorage.setItem('productObject',JSON.stringify(this.orderService.productObject));
        // this.router.navigate(['order-detail'])
        this.router.navigate(['order-detail', this.shopId, 0]);
      }  

    }
     

  }
  selectedAttribute(attribute) {
    console.log(attribute)
    if (attribute.selected === false) {
      for (var i = 0; i < this.attributes.length; i++) {
        this.attributes[i].selected = false
      }
      attribute.selected = true
      this.attribute = attribute.name
    } else {
      attribute.selected = false
      this.attribute = ''
    }
    console.log(this.attribute)
  }
}
