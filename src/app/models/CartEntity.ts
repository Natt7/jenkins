import {BrandModel} from './BrandEntity';

class CartProductEntity {
  cart_id: number;
  created_at: string;
  id: number;
  product_admin_id: string;
  product_id: number;
  product_price: number;
  product_summary: string;
  product_thumb: string;
  product_title: string;
  status: number;
  unit: number
  updated_at: string
  product: any;
  product_attributes: string;
}

export class CartEntity {
  brand: BrandModel;
  products: CartProductEntity[] = [];
}
