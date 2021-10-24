import {
  AfterViewChecked, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, HostBinding, NgModule, OnInit,
  ViewEncapsulation
} from '@angular/core';
import {ApiService} from '../service/api.service';
import {BaseComponent} from '../base.component';
import {Title} from '@angular/platform-browser';
import {fadeInAnimation} from '../_animate/index';
import {CommonModule, Location} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {slideInOutAnimation} from '../_animate';
import {UserService} from '../service/user.service';
import {UIService} from '../service/ui.service';
import {ActivatedRoute} from '@angular/router';
import {GlobalService} from '../service/global.service';

@Component({
  templateUrl: './index.html',
})
export class AuthLoginComponent implements OnInit, AfterViewChecked {

  constructor(protected titleService: Title,
              public userService: UserService,
              private location: Location,
              private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    if (this.userService.judgeLogin()) {
      this.location.back()
    }
    this.userService.loginSuccess.subscribe(data => {
      if (data) {
        this.location.back()
      }
    });
  }
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
  ],
  exports: [AuthLoginComponent],
  declarations: [
    AuthLoginComponent,
  ],
})
export class AuthLoginModule {
}

