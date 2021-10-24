import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {WechatService} from '../service/wechat.service';
import {GlobalService} from '../service/global.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../service/user.service';
import {CommonHelper} from '../helper/CommonHelper';
import {Observable} from 'rxjs/Observable';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-cmw',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  message: any;

  constructor(private  wechatService: WechatService,
              private globalService: GlobalService,
              private route: ActivatedRoute,
              public userService: UserService,
              @Inject('LOCALSTORAGE') private localStorage: any,
              private router: Router,
              private cdRef: ChangeDetectorRef) {
    this.wechatService.initConfig();
    this.userService.initUserProfile();
    this.userService.showLogin.subscribe(data => {
      if (data) {
        this.router.navigate(['login']);
      }
    });

    const combine: Observable<any> = this.userService.userBehavior.combineLatest(this.globalService.shopInfoBehavior, (x, y) => {
      if (x !== null && y !== null) {
        return true;
      } else {
        return false;
      }
    });
    combine.subscribe(data => {
      if (data) {
        const webSocket = new WebSocket(`ws://persona.imnumerique.com:80/api/project/${this.globalService.shopModel.project_id}?channel=${this.globalService.shopModel.channel_persona_id}&openId=${this.userService.identity.openid}&tempId=${localStorage.getItem('tempId')}`);
        webSocket.onopen = function () {
          // console.log('connected');
        };
      }
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }


  ngOnInit(): void {
    const item = this.localStorage.getItem('tempId');
    if (!item) {
      this.localStorage.setItem('tempId', CommonHelper.uuid());
    }
  }
}

