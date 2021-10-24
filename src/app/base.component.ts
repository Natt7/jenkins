/**
 * Created by air on 11/07/2017.
 */
import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ApiService} from "./service/api.service";
import {Title} from "@angular/platform-browser";
declare var wx: any

@Component({
  encapsulation: ViewEncapsulation.Native,
  template: `
    加载中
  `
})

export class BaseComponent {
  title = "产品列表";
  constructor(protected apiService: ApiService, protected titleService: Title) {
    this.titleService.setTitle(this.title)
  }
}
