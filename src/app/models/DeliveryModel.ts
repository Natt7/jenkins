import {DeliveryProductModel} from './DeliveryProductModel';

export class DeliveryModel {
  code = '';
  unit: number;
  price: number;
  products: DeliveryProductModel[] = [];
}
