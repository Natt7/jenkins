///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnInit, ViewEncapsulation, OnDestroy, HostBinding} from '@angular/core';
import {ApiService} from '../service/api.service';
import {BaseComponent} from '../base.component';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/fade-in.animation';
import {ProductService} from '../service/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {CartService} from '../service/cart.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/map';
import {BannerService} from '../service/banner.service';
import {BannerModel} from '../models/BannerModel';
import {GlobalService} from '../service/global.service';
import {NgxCarousel} from 'ngx-carousel';
import {WechatService} from '../service/wechat.service';
import {Observable} from 'rxjs/Observable';
import {CouponService} from '../service/coupon.service';
import {UserService} from '../service/user.service';
import {environment} from '../../environments/environment';
import {OrderService} from '../service/order.service';
declare var $: any;
declare var wx: any;

import {
  trigger,  // 动画封装触发，外部的触发器
  state, // 转场状态控制
  style, // 用来书写基本的样式
  transition, // 用来实现css3的 transition
  animate, // 用来实现css3的animations
  keyframes // 用来实现css3 keyframes的
} from "@angular/animations";

@Component({
  moduleId: module.id.toString(),
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [ApiService],
  animations: [ // 动画的内容
    trigger('visibilityChanged', [
      // state 控制不同的状态下对应的不同的样式
      state('shown' , style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      // transition 控制状态到状态以什么样的方式来进行转换
      transition('shown => hidden', animate('500ms')),
      transition('hidden => shown', animate('500ms')),
    ])
  ]
})
export class IndexComponent implements OnInit, OnDestroy {
  seekContent: any = ''

  brands: Array<any>;
  cartCount = 0;
  title = '产品列表';
  shopId: any;
  tagName: any;
  banners: BannerModel[] = [];
  subscription: Subscription;
  hasCoupon = false;
  shop_type: number;
  is_subscribe = false;
  // pdzhognqiu = false
  pdprojecttype = ""
  kolUrl: any = ''
  kolId: any = ''
  visibility = 'hidden' // 控制近期订单动画显示隐藏
  recentHeaderImg = ''
  recentName = ''

  t: any

  test:any = ''
  test2:any = ''

  pdalert = false
  alertText = ''
  pdwelfare = false
  pdshopID = false
  pdtopsubscribe = false
  pdminiApp = false

  pdloading = true
  pdseek = false

  //endtime : number; // 限时结束时间
  //pdtimelimit = false; //判断显示倒计时
  //gaptime : number; // 相差时间毫秒数
  //day : string;   // 天数
  //hours : string;   // 小时数
  //minutes : string;   // 分钟数
  //seconds : string;   // 秒数

  public carouselOne: NgxCarousel;

  constructor(protected cartService: CartService,
              protected router: Router,
              protected route: ActivatedRoute,
              protected productService: ProductService,
              protected apiService: ApiService,
              protected titleService: Title,
              protected bannerService: BannerService,
              private globalService: GlobalService,
              public couponService: CouponService,
              protected orderService: OrderService,
              public userService: UserService,
              public wechatService: WechatService) {
    this.route.params.subscribe(params => {

      // 判断从我的优惠券 和购买成功页跳转回首页和商品详情页是否需要刷新
      if (this.orderService.pdJumpIndex === true) {
        window.location.reload();
      }

      this.shopId = params.shopId;
      // 判断是否为某些商城
      if (
          // this.shopId === 'b14c92f4-212f-40c2-8bc5-e2b2c878b1b2' ||
          this.shopId === '07c361ed-ca7e-48c4-bf8d-098d11d21bed' ||
          this.shopId === '8204981d-3d6f-44b5-9020-07af8290d027' ||
          this.shopId === 'daa61de4-003f-4a54-9bd4-07a635b70a4c' ||
          this.shopId === 'fb3ff850-50da-4093-93a0-de6c39e8cf3c' ||
          this.shopId === 'b3589a7e-da5a-46cc-8e3a-5b3d2c6242f3' ||
          this.shopId === 'ec15a649-af08-4e01-aa39-3899b8e8fe1f' ||
          this.shopId === 'cbabddf2-6a06-4fda-9976-cbe96960994b' ||
          this.shopId === 'ace7346d-e5ff-4836-9172-f86202d8310b' ||
          this.shopId === '52d0c71f-95f8-4fc1-b58b-9a4f3a908b2e' ||
          this.shopId === '0c4a3df2-cd6f-426f-8a3f-af5164fa0c55' ||
          this.shopId === '58169bdd-11a0-468f-9035-ee2b0f2d0396' ||
          this.shopId === 'fd3ee1dd-f98e-4442-ae70-96922f538bff' ||
          this.shopId === '695c3bc8-236c-41ff-8558-7605a00c8da3' ||
          this.shopId === '9f03bf43-ead7-4ac4-82d8-e15b06dce991' ||
          this.shopId === 'cb9d876e-a1cb-4f85-bd2d-f619f2b4b456' ||
          this.shopId === 'cea4a995-7f16-48f7-8d25-805384cbbbb9' ||
          this.shopId === '83dc67b7-06e3-4983-9bfe-5baf51285586' ||
          this.shopId === '79affdcf-a521-4432-9bbf-3d021fc068c6' ||
          this.shopId === 'a3b96bef-3899-49e3-afef-05a482730992' ||
          this.shopId === 'a0e550dc-eb6a-48eb-885f-e6d457433653' ||
          this.shopId === '82908210-5869-4938-b3aa-67d825094fbb'
        ) {
        this.pdshopID = true
      }
      // 如果shopid带%23wechat_redirect 重定向
      if (this.shopId.indexOf("#wechat_redirect") !== -1) {
        var shopid = this.shopId.substring(0, 36);
        // console.log(shopid)
        window.location.href = "https://dudu.imnumerique.com/frontend/#/index/" + shopid
      }

      this.globalService.statisticsPage(this.shopId, '首页').subscribe(data => {});
      this.cartService.updateCartCount(this.shopId);
      this.globalService.initShopInfo(this.shopId);
      this.globalService.shopInfo(this.shopId).subscribe(data => {
        // console.log("!!!!!!!!!!!")
        // console.log(data)
        if (data.result.avatar_url) {
          this.kolUrl = data.result.avatar_url
        } else {
          this.kolUrl = 'assets/images/index/8_03.png'
        }
        this.kolId = data.result.channel_id
        
      });

      const combine: Observable<any> = this.wechatService.jsSignBehavior.combineLatest(this.globalService.shopInfoBehavior, (x, y) => {
        if (x && y !== null) {
          return y;
        } else {
          return false;
        }
      });
      combine.subscribe(data => {
        this.couponService.kolname = data.channel_name; // 获得KOL名称

        // console.log(this.couponService)
        // console.log("shopInfoBehavior")
        // console.log(this.globalService.shopInfoBehavior)

        this.userService.user().subscribe(data => { // 获取是否分享
          // console.log(data.result)
          this.wechatService.pdisShare = data.result.profile.is_shared
          // console.log(this.wechatService.pdisShare)
        });
        // alert(this.wechatService.pdisShare)

        this.globalService.initSubscription(this.shopId).subscribe(data => {
          if (data.result_code === '10000') {
            this.couponService.pdsubscribe = data.result.is_subscription // 获得是否订阅
          }
        });
        this.couponService.kolid = data.channel_id; // 获得KOL id
        if (data) {
           // console.log(data)
           var project_type = data.project_type
          if (data.project_type === 1) {   // 如果项目为普通项目  时间结束时跳到时间结束页
            if ((new Date(data.end_time).getTime() - new Date().getTime()) <= 0) {
              this.couponService.pdendtime = true // 判断项目结束变量为 true 已结束
              this.router.navigate(['timeout', this.shopId]);
            }
          }
          // console.log(this.couponService.pdsetInterval)
          if (this.couponService.pdsetInterval === true) {    // 判断限时定时器只执行一次
            if (data.project_type === 2) {    // 判断当前项目是否是限时项目
              // console.log(data)
              // console.log(project_type)
              // console.log(data.project_type)
              // console.log("执行了定时器")
              this.pdprojecttype = "限时"
              this.couponService.pdtimelimit = true
              this.couponService.endtime = new Date(data.end_time).getTime();
              // console.log(this.couponService.endtime)
              // console.log("结束毫秒数："+this.couponService.endtime)
              // console.log("现在毫秒数："+new Date().getTime())
              this.couponService.gaptime = this.couponService.endtime- new Date().getTime();  // 得到毫秒数
              // console.log("相差毫秒数："+ this.couponService.gaptime)
              //this.couponService.gaptime = 9010
              if (this.couponService.gaptime <= 0) {                // 判断是否结束
                //alert("限时抢购已结束1")
                this.couponService.pdendtime = true // 判断项目结束变量为 true 已结束
                this.router.navigate(['timeout', this.shopId]);
              } else {

               // console.log("天数")
                this.couponService.day = (Math.floor(this.couponService.gaptime / ((1000 * 60 * 60 * 24)))).toString();
                if (Number(this.couponService.day) < 10) {
                  this.couponService.day = "0" + this.couponService.day
                }
                // console.log(this.couponService.day)
                // console.log("时数")
                this.couponService.hours = (Math.floor((this.couponService.gaptime - (Number(this.couponService.day) * 86400000)) / (1000 * 60 * 60))).toString()
                if (Number(this.couponService.hours) < 10) {
                  this.couponService.hours = "0" + this.couponService.hours
                }
                // console.log(this.couponService.hours)
                // console.log("分钟数")
                this.couponService.minutes = (Math.floor((this.couponService.gaptime - (Number(this.couponService.day) * 86400000) - (Number(this.couponService.hours) * 3600000)) / (1000 * 60))).toString()
                if (Number(this.couponService.minutes) < 10) {
                  this.couponService.minutes = "0" + this.couponService.minutes
                }
                // console.log(this.couponService.minutes)
                // console.log("秒数")
                this.couponService.seconds = (Math.floor((this.couponService.gaptime - (Number(this.couponService.day) * 86400000) - (Number(this.couponService.hours) * 3600000) - (Number(this.couponService.minutes) * 60000)) / 1000)).toString()
                if (Number(this.couponService.seconds) < 10) {
                  this.couponService.seconds = "0" + this.couponService.seconds
                }
                if (Number(this.couponService.seconds) === 0 && Number(this.couponService.minutes) === 0 && Number(this.couponService.hours) === 0 && Number(this.couponService.day) === 0) {
                  //alert("限时抢购已结束2")
                  this.couponService.pdendtime = true // 判断项目结束变量为 true 已结束
                  this.router.navigate(['timeout', this.shopId]);
                }
               // console.log(this.couponService.seconds)
                const thiss = this
                var t1 = setInterval(function(){                 // 开始倒计时
                  thiss.couponService.gaptime = thiss.couponService.gaptime - 1000
                 // console.log("天数")
                  thiss.couponService.day = (Math.floor(thiss.couponService.gaptime / ((1000 * 60 * 60 * 24)))).toString()
                  if (Number(thiss.couponService.day) < 10) {
                    thiss.couponService.day = "0" + thiss.couponService.day
                  }
                  // console.log(thiss.couponService.day)
                  // console.log("时数")
                  thiss.couponService.hours = (Math.floor((thiss.couponService.gaptime - (Number(thiss.couponService.day) * 86400000)) / (1000 * 60 * 60))).toString()
                  if (Number(thiss.couponService.hours) < 10) {
                    thiss.couponService.hours = "0" + thiss.couponService.hours
                  }
                  // console.log(thiss.couponService.hours)
                  // console.log("分钟数")
                  thiss.couponService.minutes = (Math.floor((thiss.couponService.gaptime - (Number(thiss.couponService.day) * 86400000) - (Number(thiss.couponService.hours) * 3600000)) / (1000 * 60))).toString()
                  if (Number(thiss.couponService.minutes) < 10) {
                    thiss.couponService.minutes = "0" + thiss.couponService.minutes
                  }
                  // console.log(thiss.couponService.minutes)
                  // console.log("秒数")
                  thiss.couponService.seconds = (Math.floor((thiss.couponService.gaptime - (Number(thiss.couponService.day) * 86400000) - (Number(thiss.couponService.hours) * 3600000) - (Number(thiss.couponService.minutes) * 60000)) / 1000)).toString()
                  if (Number(thiss.couponService.seconds) < 10) {
                    thiss.couponService.seconds = "0" + thiss.couponService.seconds
                  }
                  console.log(thiss.couponService.seconds)
                  if (Number(thiss.couponService.seconds) === 0 && Number(thiss.couponService.minutes) === 0 && Number(thiss.couponService.hours) === 0 && Number(thiss.couponService.day) === 0) {
                    //alert("限时抢购已结束2")
                    clearInterval(t1);
                    thiss.couponService.pdendtime = true // 判断项目结束变量为 true 已结束
                    thiss.router.navigate(['timeout', thiss.shopId]);
                  }

                }, 1000)

              }
            }
            this.couponService.pdsetInterval = false
          } // 判断来回切换定时器执行

          var url = `${environment.page_host}/#/index/${this.shopId}`;
          this.wechatService.configShare(data.title, data.description, url, data.thumb, this.shopId, '首页');
        }
      });

      this.bannerService.index(params.shopId).subscribe(data => {
        Object.assign(this.banners, data.result);
        this.banners.forEach(b => {
        })
      });
      this.productService.getProducts(params.shopId, params.tagName, '').subscribe(data => {
        this.brands = data.result;
        this.pdloading = false

        if (this.pdprojecttype === "限时") {
          var pdcoupon = false
          for (var i = 0; i < this.brands.length; i++) {
            if (this.brands[i].products.length > 0) {
              var pdcoupon = true
            }
          }
          if (pdcoupon === false) {
            this.couponService.pdendtime = true // 判断项目结束变量为 true 已结束
            this.router.navigate(['timeout', this.shopId]);
          }
        }


        this.shop_type = this.globalService.shopModel.project_type;
      });

      this.couponService.hasCoupon(params.shopId).subscribe(data => {
        this.hasCoupon = data.result.has;
      });
    });
  }

  ngOnInit(): void {
    // if (window.history.length <= 2) {
    //   localStorage.removeItem("frontendhistory")
    //   localStorage.setItem("frontendhistory","true");
    //     window.history.pushState({}, "title", "#/index/"+this.shopId);
    //     window.addEventListener("popstate", function(e) {
    //         // window.open("http://www.baidu.com");
    //         if (localStorage.getItem("frontendhistory") === "true") {
    //           window.location.href="http://static.imnumerique.com/redsattention/index.html";
    //         }
    //         // alert('返回')
    //     }, false);
    // }
    var that = this
    if (this.couponService.pdendtime === true) {      //判断项目结束时间true 跳转到时间结束页 防止从结束页返回首页
      this.router.navigate(['timeout', this.shopId]);
    }
    wx.miniProgram.getEnv(function(res) {
      // console.log(res)
      if (res.miniprogram) {
        that.pdminiApp = true
      } else {
        that.pdminiApp = false
      }
      
    })


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

    this.subscription = this.cartService.getCartCountObservable().subscribe(message => {
      this.cartCount = message
    });

    // if (this.globalService.pdneworder === false) {

        // 近期订单
    this.subscription = this.cartService.recentOrder(this.shopId).subscribe(data => {
      // console.log(data)
      // this.globalService.pdneworder = true
      var time = data.result.length
      var i = 0
      i++
      if (data.result[i - 1].thumb === '') {
        that.recentHeaderImg = 'assets/images/mine/thumb.png'
      } else {
        that.recentHeaderImg = data.result[i - 1].thumb
      }
      that.recentName = data.result[i - 1].nickname
      document.getElementById("recentOrder").style.opacity = "1"
      // that.visibility = 'shown'
      setTimeout(function() {
        document.getElementById("recentOrder").style.opacity = "0"
        // that.visibility = 'hidden'
      }, 6000)
      if (i === time) {
         
      } else {
      this.t = setInterval(function() {
        i++
        if (data.result[i - 1].thumb === '') {
          that.recentHeaderImg = 'assets/images/mine/thumb.png'
        } else {
          that.recentHeaderImg = data.result[i - 1].thumb
        }
        that.recentName = data.result[i - 1].nickname
        document.getElementById("recentOrder").style.opacity = "1"
        // that.visibility = 'shown'
        setTimeout(function() {
          document.getElementById("recentOrder").style.opacity = "0"
          // that.visibility = 'hidden'
        }, 6000)
        if (i === time) {
          clearInterval(that.t)
        }
      }, 7000)
      }

    });


    // }

    // setTimeout(function() {
    //   _this.visibility = 'hidden'
    // }, 5000)

  }
  gominiApp() {
    const thatt = this
    this.test = "aaaaaaaaaaaaaaaaaddddddddddddddddddddd"
    // console.log(wx.miniProgram.redirectTo)
    this.test = wx.miniProgram.redirectTo
    wx.checkJsApi({
      jsApiList: ['miniProgram'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
      success: function(res) {
        thatt.test2 = res.errMsg
        // console.log(res)
      // 以键值对的形式返回，可用的api值true，不可用为false
      // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
      }
    });

    wx.miniProgram.redirectTo({
        url: '/pages/index/index',
        success(e) {
          // console.log(e)
          thatt.test = e
        },
        fail(e) {
          // console.log(e)
          thatt.test = e
          // console.log(e.errMsg)
        },
    })
  }

  ngOnDestroy(): void {
    clearInterval(this.t)
    localStorage.setItem("frontendhistory","false");
    this.subscription.unsubscribe();
  }
  // 订阅按钮
  subscribeclick() {
    if (this.userService.judgeUserMobile()) {  // 判断用户
      this.userService.subscribe(this.couponService.kolid).subscribe(s => {
        this.couponService.pdsubscribe = true;   // 判断订阅为true
        this.couponService.pdxssubscribe = true //  判断显示为true
      });
    } else {
      this.couponService.pdlogsubscribe = true     // 是否登录订阅
      this.router.navigate(['login']);
    } 
    // if (this.userService.pdregistered === false) {   // 没注册
    //   this.couponService.pdlogsubscribe = true     // 是否登录订阅
    //   this.router.navigate(['login']);
    // }
    // if (this.userService.pdregistered === true) {     // 已注册
    //   this.userService.subscribe(this.couponService.kolid).subscribe(s => {
    //     this.couponService.pdsubscribe = true;   // 判断订阅为true
    //     this.couponService.pdxssubscribe = true //  判断显示为true
    //   });
    // }
  }
  goDetail(product) {
    this.router.navigate(['detail', this.shopId, product.id]);
  }
  bannerGoDetail(banner) {
    if (banner.product_id !== null) {
      this.router.navigate(['detail', this.shopId, banner.product_id]);
    }
  }
  subscribelayer() {
    this.couponService.pdxssubscribe = false //  判断显示为false
  }
  takered() {
    this.wechatService.shareGetRed().subscribe(data => { // 获取是否分享
      // console.log(data)
      if (data.result_code === "10000") {
        // console.log("领取成功")
        this.wechatService.shareRedBin = false
        // window.location.href = data.result.url
      } else {
        alert(data.reason)
      }
    });
  }
  poster() {
    this.couponService.pdposter = false //  判断显示为false
  }
  zhongqiu() {
    this.userService.pdzhognqiu = false
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
  pageEvent($event) {
    if (parseInt($event.target.scrollTop) >= 585) {
      if (this.pdtopsubscribe == false) {
        this.pdtopsubscribe = true
      }
    } else {
      if (this.pdtopsubscribe == true) {
        this.pdtopsubscribe = false
      }
    }
  }
  couponBut() {
    if (this.userService.judgeUserMobile()) {  // 判断用户
      this.router.navigate(['receive-coupon', this.shopId]);
    } else {
      this.router.navigate(['login']);
    } 
    // [routerLink]="['/receive-coupon', shopId]"
  }
  nocouponBut() {
    this.alertText = "该商城暂无优惠券"
    this.pdalert = true
  }
  qxalert() {
    this.alertText = ""
    this.pdalert = false
  }
  welfareBut() {
    this.pdwelfare = true
  }
  gbwelfare() {
    this.pdwelfare = false
  }
  subscribebut() {
    this.router.navigate(['correlation-shop', this.shopId, this.kolId]);
  }
  seekBut() {
    if (this.seekContent == '') {
      return false
    }
    this.router.navigate(['index-seek', this.shopId, this.seekContent]);
  }
  keyup(event) {
    // alert(event.keyCode)
    if (event.keyCode == 13) {
      this.seekBut()
    }
    // console.log(event)
  }
  focus() {
    this.pdseek = true
  }
  blur() {
    this.pdseek = false
  }
}
