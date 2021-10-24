/**
 * Created by air on 21/05/2017.
 */
import {Inject, Injectable} from '@angular/core';

import 'rxjs/add/operator/map';
import {environment} from './../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {HttpResponse} from '../models/HttpResponse';
import {Router} from '@angular/router';

@Injectable()
export class HttpService {
  constructor(public http: HttpClient,
              public router: Router,
              @Inject('LOCALSTORAGE') public localStorage: any) {
  }

  post(url, params: Object = {}): Observable<HttpResponse> {
    if (this.localStorage.getItem('wechat_access_token')) {
      const httpHeaders = new HttpHeaders({
        'Access-Token': this.localStorage.getItem('wechat_access_token'),
      });
      return this.http.post<HttpResponse>(environment.host + url, params, {
        headers: httpHeaders
      });
    } else {
      return this.http.post<HttpResponse>(environment.host + url, params);
    }
  }

  get(url, params: Object = {}): Observable<HttpResponse> {
    let httpParams = new HttpParams();
    Object.keys(params).map(key => {
      httpParams = httpParams.set(key, params[key]);
    });
    if (this.localStorage.getItem('wechat_access_token')) {
      const httpHeaders = new HttpHeaders({
        'Access-Token': this.localStorage.getItem('wechat_access_token'),
      });
      return this.http.get<HttpResponse>(environment.host + url, {
        params: httpParams,
        headers: httpHeaders
      });
    } else {
      return this.http.get<HttpResponse>(environment.host + url, {
        params: httpParams,
      });
    }
  }
}
