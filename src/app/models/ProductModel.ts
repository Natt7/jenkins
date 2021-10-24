import {BaseModel} from './BaseModel';
import {BrandModel} from './BrandEntity';

/**
 * Created by air on 22/11/2017.
 */
export class ProductModel extends BaseModel {
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
  products_type: string;
  purchase_amount: number;
  surplus: number;
  sale_type: number;
  online_status: number;
  brand: BrandModel = new BrandModel();
  attributes: string[] = [];
}
