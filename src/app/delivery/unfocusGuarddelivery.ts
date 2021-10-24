import { CanDeactivate } from '@angular/router';
import { DeliveryComponent } from './delivery.component';

export class LeaveGuarddelivery implements CanDeactivate<DeliveryComponent> {
	  // constructor(protected globalService: GlobalService) {}

    canDeactivate (component: DeliveryComponent) {
        // return window.confirm("确定要离开吗");
        console.log(component.pdLeaveGuarddelivery)
        return component.pdLeaveGuarddelivery
    }
}
