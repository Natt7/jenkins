import {Inject, Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {HttpResponse} from '../models/HttpResponse';
import {UserService} from '../service/user.service';
import {UserModel} from '../models/UserModel';
import {GlobalService} from '../service/global.service';

/**
 * Guard to determine if the sidenav can load, based on if the section exists in documentation
 * items.
 */
@Injectable()
export class CanActivateComponent implements CanActivate {
  constructor(private router: Router,
              private http: HttpClient,
              private userService: UserService,
              private globalService: GlobalService,
              @Inject('LOCALSTORAGE') private localStorage: any) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.globalService.isWechat()) {
      const re = /access_token=([^&^/^#]*)/i;
      const found = window.location.href.match(re);
      const access_token = found ? found[1] : undefined;
      const href = `${environment.login_redirect}?redirect_uri=${encodeURIComponent(window.location.href)}`;

      const localAccessToken = this.localStorage.getItem('wechat_access_token');
      if (localAccessToken && localAccessToken !== '' && localAccessToken !== null) {
        this.userService.validateAccessToken(localAccessToken)
          .subscribe(data => {
            if (data.result_code !== '10000') {
              this.localStorage.setItem('wechat_access_token', '');
              window.location.href = href;
            }
          });
      } else {
        if (access_token && access_token !== 'null' && access_token !== '') {
          this.localStorage.setItem('wechat_access_token', access_token);
          this.userService.initUserProfile();
        } else {
          window.location.href = href;
        }
      }
    }
    return true;
  }
}
