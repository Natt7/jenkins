import { CanDeactivate } from '@angular/router';
import { PaySuccessDeliveryComponent } from './pay-success-delivery.component';

export class LeaveGuardpaydelivery implements CanDeactivate<PaySuccessDeliveryComponent> {
	  // constructor(protected globalService: GlobalService) {}

    canDeactivate (component: PaySuccessDeliveryComponent) {
        // return window.confirm("确定要离开吗");
        console.log(component.pdLeaveGuarddelivery)
        return component.pdLeaveGuarddelivery
    }
}
