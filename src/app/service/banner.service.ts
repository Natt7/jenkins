import {Injectable} from '@angular/core';

import 'rxjs/add/operator/map';
import {environment} from './../../environments/environment';
import {HttpService} from './http.service';
import {Observable} from 'rxjs/Observable';
import {HttpResponse} from '../models/HttpResponse';

@Injectable()
export class BannerService extends HttpService {
  index(shopId): Observable<HttpResponse> {
    return this.get(`shop/banner/index?shop_id=${shopId}`);
  }
}
