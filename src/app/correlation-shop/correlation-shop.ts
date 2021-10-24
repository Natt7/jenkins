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
@Component({
  templateUrl: './correlation-shop.html',
  styleUrls: ['./correlation-shop.css'],
})
export class CorrelationShopComponent implements OnInit {

  shopId: any = ''
  kolId: any = ''
  tableNum: number = 1
  banners: any[] = [
    "assets/images/index/timenum.png",
    "assets/images/index/timenum.png",
    "assets/images/index/timenum.png",
    "assets/images/index/timenum.png"
  ]
  page: any = 0
  pageSize: any = 5
  newArr: any[] = []
  newsumpage: any = 0

  oldpage: any = 0
  oldArr: any[] = []
  oldsumpage: any = 0
  public carouselOne: NgxCarousel;
  constructor(
      protected router: Router,
      protected route: ActivatedRoute,
      public userService: UserService,  
    ) {
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params)
      this.shopId = params.shopId
      this.kolId = params.id


    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            position: absolute;
            width: 100%;
            bottom: 20px;
            left: 0;
            box-sizing: border-box;
          }
          .ngxcarouselPoint li {
            display: inline-block;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.55);
            padding: 5px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngxcarouselPoint li.active {
              background: white;
              // width: 10px;
          }
        `
      },
      load: 2,
      touch: true,
      loop: true,
      custom: 'banner',
      easing: 'ease',
    };

    this.userService.corrslationShop(this.page, this.pageSize, this.kolId, 1).subscribe(data => { 
      this.newArr = data.result
      this.newsumpage = Math.floor((data.page.totalCount) / 5)
    });
    this.userService.corrslationShop(this.oldpage, this.pageSize, this.kolId, 2).subscribe(data => { 
      this.oldArr = data.result
      console.log("!!!!!!!!!!!!!!")
      console.log(data)
      this.oldsumpage = Math.floor((data.page.totalCount) / 5)
      console.log(this.oldsumpage)
    });


    })



    
  }
  tableSelect(num) {
    console.log(num)
    if (num == 1) {
      this.tableNum = 1
      return
    } 
    if (num == 2) {
      this.tableNum = 2
      return
    }
  }
  pageEvent($event) {
    // console.log($event)
    const thisa = this
    if ((parseInt($event.target.clientHeight) + parseInt($event.target.scrollTop)) === parseInt($event.target.scrollHeight)) {
      console.log("到底")
      if (this.tableNum == 1) {  // 最新
        console.log(this.page)
        console.log(this.newsumpage)
        if(this.page < this.newsumpage) {
          this.page = this.page + 1
          console.log(this.page)
          this.userService.corrslationShop(this.page, this.pageSize, this.kolId, 1).subscribe(data => { 
            console.log(data)
            for (let i = 0; i < data.result.length; i++) {
              this.newArr.push(data.result[i])
            }
          });
        }
      }
      if (this.tableNum == 2) {  // 过期
        console.log(this.oldpage)
        console.log(this.oldsumpage)
        if(this.oldpage < this.oldsumpage) {
          this.oldpage = this.oldpage + 1
          console.log(this.oldpage)
          this.userService.corrslationShop(this.oldpage, this.pageSize, this.kolId, 2).subscribe(data => { 
            console.log(data)
            for (let i = 0; i < data.result.length; i++) {
              this.oldArr.push(data.result[i])
            }
          });
        }
      }
    }
  }
  gyg(code) {
    console.log(code)
  }

}
