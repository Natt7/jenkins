import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {BaseComponent} from '../base.component';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../service/product.service';
import {CartService} from '../service/cart.service';
import {Subscription} from 'rxjs/Subscription';

import {Observable} from 'rxjs/Observable';
import {ProductModel} from '../models/ProductModel';
import 'rxjs/add/observable/from';
import {WechatService} from '../service/wechat.service';
import {GlobalService} from '../service/global.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {NgxCarousel} from 'ngx-carousel';
import {CouponService} from '../service/coupon.service';
import {environment} from '../../environments/environment';
import {OrderService} from '../service/order.service';
import {UserService} from '../service/user.service';
// import {QRCodeComponent} from 'angular2-qrcode';
@Component({
  // directives: [QRCodeComponent],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [ApiService],
  animations: [fadeInAnimation]
})
export class DetailComponent implements OnInit, OnDestroy {
  shopId;
  cartCount = 0;
  subscription: Subscription;
  product = new ProductModel;
  productBehavior: BehaviorSubject<ProductModel> = new BehaviorSubject<ProductModel>(null);
  title = '产品列表';
  isShowShare = false;
  isShowCode = false
  public carouselOne: NgxCarousel;
  images: string[] = [];

  shareRed = false // 判断分享红包
  pdshopID = false

  qrcodeText: any = ''
  domArr: any[] = []

  i: any
  img: any = 'data:image/jpeg;base64,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'
  ngOnInit(): void {



    // const thisthis = this
    // setInterval(function(){
    //   console.log(thisthis.wechatService.shareRedBin)
    //   thisthis.shareRed = thisthis.wechatService.shareRedBin
    // },1000)

    this.subscription = this.cartService.getCartCountObservable().subscribe(message => {
      this.cartCount = message
    });

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
      easing: 'ease'
    };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(protected cartService: CartService,
              protected route: ActivatedRoute,
              protected router: Router,
              protected productService: ProductService,
              protected apiService: ApiService,
              protected titleService: Title,
              protected orderService: OrderService,
              public wechatService: WechatService,
              public couponService: CouponService,
              public userService: UserService,
              protected globalService: GlobalService) {

    // 判断从我的优惠券 和购买成功页跳转回首页和商品详情页是否需要刷新
    if (this.orderService.pdJumpIndex === true) {
      window.location.reload();
    }
    this.route.params
      .subscribe(params => {
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

        this.globalService.initShopInfo(this.shopId);
        this.globalService.statisticsPage(this.shopId, '产品详情').subscribe(data => {
        });

        this.cartService.updateCartCount(this.shopId);
        productService.getProduct(params.productId, this.shopId).subscribe(res => {
          this.product = res.result;
          this.images = this.product.thumbs.split(';');
          this.productBehavior.next(this.product);
        });
      })

    const combine: Observable<any> = this.wechatService.jsSignBehavior.combineLatest(this.productBehavior, (x, y) => {
      if (x && y !== null) {
        return y;
      } else {
        return false;
      }
    });
    // console.log("!!!!!!!!!!!!!")
    // console.log(this.shopId)
    // console.log("!!!!!!!!!!!!!")
    combine.subscribe(data => {
      if (data) {
        // http://dudu.imnumerique.com/frontend/#/detail/aadad32d-0bdb-48d8-8472-ad19f3280f1b/1092
        var urltext = window.location.href
        var urlarr = urltext.split('detail/')
        var url = `${environment.page_host}/#/detail/${urlarr[urlarr.length - 1]}`;
        this.qrcodeText = url

        this.wechatService.configShare(data.title, data.summary, url, data.thumb, this.shopId, '商品详情');
      }
    });

    // 请求商城信息 判断定时器
    const combineb: Observable<any> = this.wechatService.jsSignBehavior.combineLatest(this.globalService.shopInfoBehavior, (x, y) => {
      if (x && y !== null) {
        return y;
      } else {
        return false;
      }
    });
    combineb.subscribe(data => {
      if (data) {
        // console.log(data)
        if (data.project_type === 1) {   // 如果项目为普通项目  时间结束时跳到时间结束页
          if ((new Date(data.end_time).getTime() - new Date().getTime()) <= 0) {
            this.couponService.pdendtime = true // 判断项目结束变量为 true 已结束
            this.router.navigate(['timeout', this.shopId]);
          }
        }
        if (this.couponService.pdsetInterval === true) {    // 判断限时定时器只执行一次
          if (data.project_type === 2) {    // 判断当前项目是否是限时项目
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
      }
    });



  }

  goCart() {
    this.router.navigate(['/cart', this.shopId])
  }

  goIndex() {
    this.router.navigate(['/index', this.shopId])
  }
  
  takered() {
    this.wechatService.shareGetRed().subscribe(data => { // 获取是否分享
      console.log(data)
      if (data.result_code === "10000") {
        console.log("领取成功")
        this.wechatService.shareRedBin = false
        // window.location.href = data.result.url
      } else {
        alert(data.reason)
      }
    });
  }
  test() {
    console.log("!!!!!!!")
    // var img = document.getElementById("downimg");
    // var alink = document.createElement("a");
    // this.i = img
    // alink.href = this.i.src;
    // alink.download = 'testImg.jpg';
    // alink.click();

  }
  downloadIamge() {
    // window.location.href = "http://dudutest.imnumerique.com/Uploads/Attachment/2018/07/9d8cae8b107b7f4636beee65d0e82521.jpg"
    // window.location.href = 'http://sansiri.imnumerique.com/wish/mp3.mp3'
    var isSupportDownload = 'download' in document.createElement('a');
    alert(isSupportDownload)
  }
      // downloadIamge() {
      //   let imgData = this.img
      //   this.downloadFile('测试.png', imgData);
      // }
      // //下载
      // downloadFile(fileName, content) {
      //   let aLink = document.createElement('a');
      //   let blob = this.base64ToBlob(content); //new Blob([content]);

      //   let evt = document.createEvent("HTMLEvents");
      //   evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      //   aLink.download = fileName;
      //   aLink.href = URL.createObjectURL(blob);

      //   // aLink.dispatchEvent(evt);
      //   aLink.click()
      // }
      //       //base64转blob
      base64ToBlob(code) {
        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {type: contentType});
      }
// downloadIamge() {
//   console.log(mui)
//   mui.ready(function () {
//         })
//   // console.log(plus)
//   // mui.plusReady(function(){
//     if (plus) {
//       console.log("!!!!!!!")
//     }
//          // 在这里调用plus api
//     console.log(plus)
//     var dtask = plus.downloader.createDownload( "https://campaign.imnumerique.com/wechat/header.jpg", {}, function ( d, status ) {
//     // 下载完成
//     if ( status == 200 ) { 
//       alert( "Download success: " + d.filename );
//     } else {
//        alert( "Download failed: " + status ); 
//     }  
//     });
//     //dtask.addEventListener( "statechanged", onStateChanged, false );
//     dtask.start(); 
//   // });

// }
  qrcodeBut() {
    console.log("!!!!!!!")
    this.domArr = []
    var dom = document.getElementById('qrcodeBut')
    this.domArr.push(dom)
    console.log(this.domArr)
    this.domArr.push(this.domArr[0].children[0].children)
    console.log(this.domArr)
    var src = this.domArr[1][0].src
    console.log(src)
    console.log(src.length)

    let aLink = document.createElement('a');

    let blob = this.base64ToBlob(src); //new Blob([content]);
    aLink.download = "fileName.png";
    aLink.href = URL.createObjectURL(blob);
    aLink.click()

  }


}
