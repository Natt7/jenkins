import {BaseModel} from './BaseModel';
import {BrandModel} from './BrandEntity';
import {ProductModel} from './ProductModel';

/**
 * Created by air on 22/11/2017.
 */
export class DeliveryProductModel extends BaseModel {
  id: number;
  created_at: string;
  title: string;
  summary: string;
  price: string;
  thumb: string;
  thumbs: string;
  mini_thumb: string;
  content: string;
  origin_price: string;
  delivery_type: string;
  purchase_amount: number;
  product: ProductModel = new ProductModel();
}
