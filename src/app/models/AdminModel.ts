import {BaseModel} from './BaseModel';
export class AdminModel extends BaseModel{
  id: string;
  name: string;
  thumb: string;
  username: string;
  email: string;

  get rules() {
    return [
      [['name', 'username', 'email'], 'required']
    ];
  }
}
