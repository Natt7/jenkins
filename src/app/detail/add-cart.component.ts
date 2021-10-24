import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import {slideInOutBottomAnimation} from '../_animate/slide-in-out-bottom.animation';
import {CartService} from '../service/cart.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../service/product.service';
import {Observable} from 'rxjs/Observable';
import {Location} from '@angular/common';
import 'rxjs/add/observable/from';
import {GlobalService} from '../service/global.service';
import {ProductModel} from '../models/ProductModel';
import {UserService} from '../service/user.service';

@Component({
  templateUrl: './add-cart.component.html',
  styleUrls: ['./add-cart.component.css'],
  providers: [ApiService],
  animations: [slideInOutBottomAnimation],
})
export class AddCartComponent implements OnInit {
  unit = 1;
  product = {
    mini_thumb: null,
    thumb: null,
    title: '',
    summary: '',
    price: '',
    sale_type: 0,
    surplus: 0,
    attributes: [],
  };
 // product: ProductModel;
  id: number;
  shopId: string;

  attributes: any[] = [];
  attribute: string = '';
  pdalert = false;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected productService: ProductService,
              protected cartService: CartService,
              protected apiService: ApiService,
              protected globalService: GlobalService,
              public userService: UserService,
              protected location: Location) {
    Observable.from(this.route.params)
      .subscribe(params => {
        setTimeout(function() {
          console.log(document.getElementById("add-cart-main"))
          document.getElementById("add-cart-main").style.bottom = "0"
        }, 200)
        this.id = params.id;
        this.shopId = params.shopId;
        this.globalService.initShopInfo(this.shopId);
        this.globalService.statisticsPage(this.shopId, '添加购物车').subscribe(data => {});
        this.cartService.updateCartCount( this.shopId );
        productService.getProduct(params.id, params.shopId).subscribe(res => {
          this.product = res.result;
          if (this.product.attributes !== null) {
            for (var i = 0; i < this.product.attributes.length; i++) {
              this.attributes.push({"name": this.product.attributes[i], "selected": false})
            }
            console.log(this.attributes)
          }
        });
      })
  }

  ngOnInit() {


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

  addToCart() {
    if (this.attributes.length > 0 && this.attribute === '') {
      this.pdalert = true;

    } else {

      if (this.userService.judgeUserMobile()) { 
      
        this.cartService.addProduct(this.shopId, this.id, this.unit, this.attribute).subscribe(res => {
          this.cartService.updateCartCount(this.shopId);
          this.back();
        });

      }

    }

  }

  back() {
    document.getElementById("add-cart-main").style.bottom = "-500px"
    const that = this
    setTimeout(function() {
      that.location.back();
    }, 500)
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
