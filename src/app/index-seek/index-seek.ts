import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseComponent} from '../base.component';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {NgxCarousel} from 'ngx-carousel';
import {environment} from '../../environments/environment';
import {UserService} from '../service/user.service';
import {CartService} from '../service/cart.service';
import {ProductService} from '../service/product.service';
@Component({
  templateUrl: './index-seek.html',
  styleUrls: ['./index-seek.css'],
})
export class IndexSeekComponent implements OnInit {

  shopId: any = ''
  seekContent: any = ''
  tagName: any
  seekArr: any[] = []

  constructor(
      protected productService: ProductService,
      protected cartService: CartService,
      protected router: Router,
      protected route: ActivatedRoute,
      public userService: UserService,  
    ) {
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params)
      this.shopId = params.shopId
      this.seekContent = params.seek
      this.tagName = params.tagName

      this.productService.getProducts(params.shopId, params.tagName, params.seek).subscribe(data => {
        console.log(data)
        this.seekArr = data.result
      })

    })
  }

  seekBut() {
    this.router.navigate(['index', this.shopId])
  }

  goDetail(product) {
    this.router.navigate(['detail', this.shopId, product.id]);
  }
  addCart(e,product) {
    e.stopPropagation(); 
    // console.log(product)
    this.cartService.addProduct(this.shopId, product.id, 1, '').subscribe(res => {
      this.cartService.updateCartCount(this.shopId);
        document.getElementById("addCart").style.opacity = "1"
        // that.visibility = 'shown'
        setTimeout(function() {
          document.getElementById("addCart").style.opacity = "0"
          // that.visibility = 'hidden'
        }, 1000)
    });
    // <a [routerLink]="['add-cart', shopId, product?.id]" style="width: 100%;height: 100%"></a>
  }
  slseekBut() {
    this.productService.getProducts(this.shopId, this.tagName, this.seekContent).subscribe(data => {
      console.log(data)
      this.seekArr = data.result
    })
  }
  keyup(event) {
    // alert(event.keyCode)
    if (event.keyCode == 13) {
      this.slseekBut()
    }
    // console.log(event)
  }
}
