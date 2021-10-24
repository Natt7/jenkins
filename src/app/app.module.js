"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var angular_1 = require("@uirouter/angular");
var animations_1 = require("@angular/platform-browser/animations");
var router_config_1 = require("./router.config");
var app_component_1 = require("./app.component");
var detail_component_1 = require("./detail/detail.component");
var products_component_1 = require("./products/products.component");
var profile_component_1 = require("./profile/profile.component");
var states_1 = require("./states");
var INITIAL_STATES = [states_1.appState, states_1.detailState, states_1.productsState, states_1.profileState];
var INITIAL_COMPONENTS = [app_component_1.AppComponent, detail_component_1.Detail, products_component_1.Products, profile_component_1.Profile];
/** Angular 2 bootstrap */
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            animations_1.BrowserAnimationsModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            angular_1.UIRouterModule.forRoot({
                states: INITIAL_STATES,
                useHash: true,
                config: router_config_1.uiRouterConfigFn
            }),
        ],
        providers: [],
        declarations: INITIAL_COMPONENTS,
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map