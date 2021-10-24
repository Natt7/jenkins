import {
  Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, HostBinding, Input, NgModule, OnInit, Output,
  ViewEncapsulation
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../service/order.service';
import {CommonModule} from '@angular/common';
import {AppRoutingModule} from 'app/bootstrap/routes';
import {CartService} from '../service/cart.service';
import 'rxjs/add/observable/from';
import {slideInOutBottomAnimation} from '../_animate/slide-in-out-bottom.animation';
import {AddressModel} from '../models/AddressModel';
import {FormsModule} from '@angular/forms';
import {AddressService} from '../service/address.service';
import {RegionSelectModule} from '../select-region/regionSelect';
import {UIService} from '../service/ui.service';
import {DeliveryModel} from '../models/DeliveryModel';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.html',
  styleUrls: ['./select-address.css'],
  animations: [slideInOutBottomAnimation],
})

export class SelectAddressComponent implements OnInit {
  // alert文字
  textAlert = '请输入正确格式'
  pdalert = false
  qkaddress = new AddressModel();

  isAddAddress = false;
  isEditAddress = false;
  needIdentity = false;
  addressForm = new AddressModel();
  addresses: AddressModel[] = [];
  @Input() delivery: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() change: EventEmitter<AddressModel> = new EventEmitter();
  @HostBinding('@slideInOutBottomAnimation') slideInOutBottomAnimation;


  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected orderService: OrderService,
              public cartService: CartService,
              protected titleService: Title,
              protected addressService: AddressService,
              protected uIService: UIService) {

  }

  ngOnInit(): void {
    // this.delivery.products.forEach(product => {
    //   if (product.product.delivery_type === '海外直邮') {
      console.log("aaaaaaaaaaa")
        this.needIdentity = this.delivery
        console.log(this.needIdentity)
      console.log("aaaaaaaaaaa")
    //   }
    // });
    this.initAddress();
  }

  // alert消失
  qxalert(){
    this.pdalert = false
  }

  choose(model: AddressModel) {
    this.addressService.yxaddress = model
    console.log(this.addressService.yxaddress)

    if (this.needIdentity && (!model.user_name || model.user_name.trim() === '' ||
        !model.user_identity || model.user_identity.trim() === '')) {
            console.log("aaaaaaaaaaaa")
      //this.uIService.toast('海外直邮，请在地址中填写身份证信息');
      this.pdalert = true
      this.textAlert = '海外直邮，请在地址中填写身份证信息'
    } else {
                  console.log("bbbbbbb")
      this.change.emit(model);

      this.closeWindow();
    }
  }

  private initAddress() {
    this.addressService.index().subscribe(data => {

      this.addresses = [];
      Object.assign(this.addresses, data.result);

      // 判断是否有过地址 没有显示新增地址
      if (this.addresses.length < 1) {
        this.isAddAddress = true;
      } 
      // else {
      // // 如果有地址 默认填第一个
      //   var _this_ = this
      // // setTimeout(function(){
      //   // console.log(data.result)
      //   // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      //   if (data.result.length > 0) {
      //     if (_this_.cartService.pdoneaddress === false) {
      //         _this_.addressService.yxaddress = data.result[0]
      //         console.log(_this_.addressService.yxaddress)
          
      //         if (_this_.needIdentity && (!data.result[0].user_name || data.result[0].user_name.trim() === '' ||
      //             !data.result[0].user_identity || data.result[0].user_identity.trim() === '')) {
      //           //this.uIService.toast('海外直邮，请在地址中填写身份证信息');
      //           _this_.pdalert = true
      //           _this_.textAlert = '海外直邮，请在地址中填写身份证信息'
      //         } else {
      //           _this_.change.emit(data.result[0]);
          
      //           _this_.closeWindow();
      //           _this_.cartService.pdoneaddress = true
      //         }
      //     }

      //   }
      // // },300)
      // }

      
    });
  }

  changeRegion($event) {
    this.addressForm.region = $event;
  }

  addAddress() {
    this.isAddAddress = true;
  }

  submitAddress() {

    if (this.needIdentity === true) {  // 如果是海外直邮
      console.log(this.addressForm.user_identity)
      // console.log()
    if(this.addressForm.user_name != '') {  // 姓名
      if (/^1[0-9]{10}$/.test(this.addressForm.mobile)) { //手机
        if (this.addressForm.region != undefined){ // 地区
          if (this.addressForm.address != undefined && this.addressForm.address != '') { // 详细地址
            if (this.addressForm.user_identity != null && this.addressForm.user_identity != '' && /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)/.test(this.addressForm.user_identity)) { // 身份证信息
              this.addressService.create(this.addressForm).subscribe(data => {
                if (data.result_code === '10000') {
                  this.initAddress();
                  this.isAddAddress = false;
                  this.isEditAddress = false;
                  this.addressForm = new AddressModel();
                } else {
                  //this.uIService.toast(data.reason);
                  this.pdalert = true
                  this.textAlert = data.reason
                }
              });
            } else {
             this.pdalert = true
             this.textAlert = '请输入正确身份证信息'
            }
          }else {
            this.pdalert = true
            this.textAlert = '请输入详细地址'
          }
        } else {
          this.pdalert = true
          this.textAlert = '请选择地区'
        }
      } else {
        this.pdalert = true
        this.textAlert = '请输入正确格式手机号'
        //this.uIService.toast('请输入正确格式手机号');
      }
    }else {
      this.pdalert = true
      this.textAlert = '请输入姓名'
    }
    

    } else {

    if(this.addressForm.name != '' || this.addressForm.user_name != '') {  // 姓名
      if (/^1[0-9]{10}$/.test(this.addressForm.mobile)) { //手机
        if (this.addressForm.region != undefined){ // 地区
          if (this.addressForm.address != undefined && this.addressForm.address != '') { // 详细地址
            //if (this.addressForm.post_code != undefined && this.addressForm.post_code != '') { // 邮政编码
              this.addressService.create(this.addressForm).subscribe(data => {
                if (data.result_code === '10000') {
                  this.initAddress();
                  this.isAddAddress = false;
                  this.isEditAddress = false;
                  this.addressForm = new AddressModel();
                } else {
                  //this.uIService.toast(data.reason);
                  this.pdalert = true
                  this.textAlert = data.reason
                }
              });
            //} else {
            //  this.pdalert = true
            //  this.textAlert = '请输入邮政编码'
            //}
          }else {
            this.pdalert = true
            this.textAlert = '请输入详细地址'
          }
        } else {
          this.pdalert = true
          this.textAlert = '请选择地区'
        }
      } else {
        this.pdalert = true
        this.textAlert = '请输入正确格式手机号'
        //this.uIService.toast('请输入正确格式手机号');
      }
    }else {
      this.pdalert = true
      this.textAlert = '请输入姓名'
    }

    }


  }

  deleteAddress() {
    console.log(this.addressService.yxaddress)
    if (!this.addressForm.id) {
      this.isEditAddress = false;
      this.isAddAddress = false;
      this.addressForm = new AddressModel();
    } else {
      this.addressService.delete(this.addressForm).subscribe(data => {
        if (data.result_code === '10000') {
          this.initAddress();
          this.isAddAddress = false;
          this.isEditAddress = false;

          // 如果删除地址id === 已选地址id 清空
          if(this.addressForm.id === this.addressService.yxaddress.id){
            this.change.emit(this.qkaddress);
          }

          this.addressForm = new AddressModel();
        } else {
          //this.uIService.toast(data.reason);
          this.pdalert = true
          this.textAlert = data.reason
        }
      });
    }
  }

  editAddress(model: AddressModel) {
    this.isEditAddress = true;
    this.addressForm = model;
  }

  closeWindow() {
    this.isEditAddress = false;
    this.isAddAddress = false;
    this.addressForm = new AddressModel();
    this.close.next(true);
  }
}

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    RegionSelectModule,
  ],
  exports: [SelectAddressComponent],
  declarations: [
    SelectAddressComponent,
  ],
  providers: [
    CartService,
    OrderService,
  ],
})
export class SelectAddressModule {
}
