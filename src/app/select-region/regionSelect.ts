/**
 * Created by air on 24/05/2017.
 */
import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {RegionSelectService} from './regionSelectService';
import {OrderService} from '../service/order.service';
import {FormsModule} from '@angular/forms';
import {CartService} from '../service/cart.service';
import {CommonModule} from '@angular/common';
import {AppRoutingModule} from '../bootstrap/routes';
import {Subject} from 'rxjs/Subject';


export class SelectRegionModel {
  id = undefined;
  name = '';
  code = '';
  ids = [];
  names = [];
}


@Component({
  selector: 'app-region-city',
  template: `
    <div id="city-select-model" class="city-select-model">
      <a class="form-control input-sm" (click)="activate()"
         [ngClass]="{'active': selected.ids.length > 0}">{{ selected.ids.length > 0 ? selected.names.join(" ") : placeholder}} <span
        class="caret"></span></a>
      <div class="city-select at-view-slide-in-right at-view-slide-out-left" id="select" [ngClass]="{\'open\': open}">
        <ul class="list-container" style="min-height:101%">
          <li (click)="close()" class="close-select">关闭</li>
          <li *ngFor="let value of keys"><a class="title">{{ value }}</a>
            <ul>
              <li *ngFor="let area of areaData[value]"><a (click)="to(level, area[0])" target="_blank">{{area[1]}}</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./regionSelect.css'],
})
export class RegionSelectComponent {
  open = false;
  panel = null;
  skipCity = null;
  active = 0;
  areaData = null;
  maxLevel = null;
  currentLevel = 1;
  currentAreaData = null;
  level = 1;
  selectDisabled = false;
  selectRegion = false;
  parentId = null;
  keys = [];
  resetKeys = [];
  selected = new SelectRegionModel();
  placeholder = null;

  inputModelValue = null;
  @Output() inputModelChange = new EventEmitter();

  @Input()
  set cmwModel(value: number) {
    this.inputModelValue = value;
    this.inputModelChange.emit(this.inputModelValue);
  };

  get cmwModel() {
    // get the latest value from _data BehaviorSubject
    return this.inputModelValue;
  }

  constructor(private regionSelectService: RegionSelectService) {
    // console.log(regionSelectService)
    // console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
    this.panel = regionSelectService.citySelectConfig.panel;
    this.skipCity = regionSelectService.citySelectConfig.skipCity;
    this.maxLevel = regionSelectService.citySelectConfig.level;
    this.panel = regionSelectService.citySelectConfig.panel;
    this.placeholder = regionSelectService.citySelectConfig.placeholder;
    this.currentAreaData = this.alphabetIndex(regionSelectService.provinceData);
    this.areaData = this.alphabetIndex(regionSelectService.provinceData);
    this.keys = Object.keys(this.areaData);
    this.resetKeys = this.keys
    this.inputModelChange.subscribe(val => {
      // console.log(val)
      // console.log("ccccccccccccccccccccccccccccccccccc")
      // console.log(this.keys)
      console.log(this.alphabetIndex(regionSelectService.provinceData))
      let defaultRegion, defaultRegion1, defaultRegion2;
      if (this.regionSelectService.provinceData[val]) {
        defaultRegion = this.regionSelectService.provinceData[val];
      }
      if (!defaultRegion) {
        for (const i in this.regionSelectService.cityData) {
          const e = this.regionSelectService.cityData[i];
          if (e[val]) {
            defaultRegion = e[val];
          }
        }
      }
      if (!defaultRegion) {
        Object.keys(this.regionSelectService.regionData).map(i => {
          const e = this.regionSelectService.regionData[i];
          if (e[val]) {
            defaultRegion = e[val];
            Object.keys(this.regionSelectService.cityData).map(j => {
              const f = this.regionSelectService.cityData[j];
              if (f[i]) {
                defaultRegion1 = f[i];
                Object.keys(this.regionSelectService.provinceData).map(k => {
                  if (k === j) {
                    defaultRegion2 = this.regionSelectService.provinceData[k];
                  }
                });
              }
            });
          }
        });

        if (defaultRegion && defaultRegion1 && defaultRegion2) {
          const selectRegionModel = new SelectRegionModel();
          selectRegionModel.id = defaultRegion['i'];
          selectRegionModel.name = defaultRegion['n'];
          selectRegionModel.code = defaultRegion['c'];
          selectRegionModel.names = [defaultRegion2['n'], defaultRegion1['n'], defaultRegion['n']];
          selectRegionModel.ids = [defaultRegion2['i'], defaultRegion1['i'], defaultRegion['i']];
          this.selected = selectRegionModel;
        }
      }
    });
  }

  activate() {
    if (this.selectDisabled) {
      return false;
    }

    this.selected = new SelectRegionModel();
    this.level = this.currentLevel;
    this.areaData = this.currentAreaData;
    if ((Object.prototype.isPrototypeOf(this.currentAreaData) && Object.keys(this.currentAreaData).length === 0)) {
      console.log('请选择城市');
    } else {
      this.open = true;
    }
  }

  alphabetIndex(items) {
    const result = {};
    for (const key in items) {
      const value = items[key];
      if (this.regionSelectService.citySelectConfig.excludeCity.indexOf(value['n']) !== -1) {

      } else {
        if (result[value['a']] === undefined) {
          result[value['a']] = [];
          result[value['a']].push([value['i'], value['n'], value['c']])
        } else {
          result[value['a']].push([value['i'], value['n'], value['c']])
        }
      }
    }
    const alphabte = new Array('A', 'B', 'C', 'D',
      'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
      'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    const arr = {};
    for (let o = 0; o < alphabte.length; o++) {
      if (result[alphabte[o]] !== undefined && result[alphabte[o]] !== '' && result[alphabte[o]] !== []) {
        arr[alphabte[o]] = result[alphabte[o]];
      }
    }
    return arr;
  }


  to(idx, id) {
    // console.log("aaaaaaaaaaaaaaaaaaaaaa")
    // console.log(idx)
    // console.log(id)
    // console.log("aaaaaaaaaaaaaaaaaaaaaa")

    if (idx <= this.maxLevel) {
      const ids = [];
      for (let j = 0; j < idx - 1; j++) {
        ids.push(this.selected.ids[j]);
      }
      this.selected.ids = ids;


      let idsCount = 0;
      for (const value of this.selected.ids) {
        idsCount++;
      }

      let regionModel;
      let regionModels;
      if (idsCount === 0) {
        regionModels = this.regionSelectService.cityData[id];
        regionModel = this.regionSelectService.provinceData[id];

        // this.skipCity
        if (idx === 1 && this.skipCity && this.skipCity.length > 0 && this.skipCity.indexOf(regionModel['n']) !== -1) {
          Object.keys(this.regionSelectService.cityData[id]).map(key => {
            if(this.regionSelectService.cityData[id][key]) {
              regionModel = this.regionSelectService.cityData[id][key];
            }
          });
          this.selected.ids.push(id);
          this.selected.ids.push(regionModel['i']);
          this.selected.names.push(regionModel['n']);
          this.selected.name = regionModel['n'];
          this.selected.id = regionModel['i'];
          this.selected.code = regionModel['c'];

          this.level++;
          return this.to(this.level, regionModel['i']);
        } else {
          this.selected.ids.push(id);
          this.selected.names.push(regionModel['n']);
          this.selected.name = regionModel['n'];
          this.selected.id = regionModel['i'];
          this.selected.code = regionModel['c'];
        }
      } else {
        const regions = null;
        let selectRegion;


        selectRegion = this.getModelById(id);
        this.selected.ids.push(id);
        this.selected.names.push(selectRegion['n']);
        this.selected.name = selectRegion['n'];
        this.selected.id = selectRegion['i'];
        this.selected.code = selectRegion['c'];


        if (this.level === 1) {
          regionModels = this.regionSelectService.cityData[this.selected.id];
        } else if (this.level === 2) {
          regionModels = this.regionSelectService.regionData[this.selected.id];
        } else {
          if (!regions) {
            regionModels = this.regionSelectService.provinceData
          }
        }
      }


      if (this.level >= this.maxLevel) {
        this.keys = this.resetKeys
        this.close();
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      } else {
        this.level = this.level + 1;
        this.areaData = this.alphabetIndex(regionModels);
        this.keys = Object.keys(this.areaData);
      }
    } else {
      this.close();
    }
    this.cmwModel = this.selected.id;
    // var x = document.getElementsByClassName("city-select");
    // 回到顶部
    document.getElementById("select").scrollTop = 0
    // console.log(x)
    // console.log("dadhaisdhiashduashdiahs")
  };

  isActive(id) {
    const width = (this.active + 1) * 2;
    id = id.toString();
    return (this.selected.id.substring(0, width) === id.substring(0, width))
  };

  getModelById(val) {
    let defaultRegion;

    if (this.regionSelectService.provinceData[val]) {
      defaultRegion = this.regionSelectService.provinceData[val];
    }
    if (!defaultRegion) {
      for (const i in this.regionSelectService.cityData) {
        const e = this.regionSelectService.cityData[i];
        if (e[val]) {
          defaultRegion = e[val];
        }
      }
    }
    if (!defaultRegion) {
      for (const i in this.regionSelectService.regionData) {
        const e = this.regionSelectService.regionData[i];
        if (e[val]) {
          defaultRegion = e[val];
        }
      }
    }
    return defaultRegion;
  };


  close() {
    this.open = false;
  };
}

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
  ],
  exports: [RegionSelectComponent],
  declarations: [
    RegionSelectComponent,
  ],
  providers: [RegionSelectService]
})
export class RegionSelectModule {
}
