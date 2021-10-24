/**
 * Created by air on 21/05/2017.
 */
import {Injectable} from '@angular/core';
import {Jsonp, RequestOptionsArgs, Headers, RequestOptions, Http} from '@angular/http';

import 'rxjs/add/operator/map';
import {environment} from './../../environments/environment';
import {HttpService} from './http.service';

@Injectable()
export class ApiService extends HttpService {
}

