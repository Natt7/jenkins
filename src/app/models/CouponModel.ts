import {BaseModel} from './BaseModel';

export class CouponModel extends BaseModel {
  title: string;
  id: number;
  description: string;
  amount: number;
  man: number;
  discount: number;
  start_time: string;
  end_time: string;


  mcn_activity_channel_id: number;
  user_coupon_id: number;
  is_receive: number;
  is_selected: number;
  channel_code: string;
  channel: string;


  get rules() {
    return [
      [['title', 'amount', 'man', 'discount'], 'required'],
      [['description'], 'string'],
    ];
  }
}
