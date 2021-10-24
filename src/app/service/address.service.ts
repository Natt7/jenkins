import {HttpService} from './http.service';
import {AddressModel} from '../models/AddressModel';

export class AddressService extends HttpService {
  yxaddress : AddressModel

  index() {
    return this.get(`shop/address/index`);
  }

  delete(model: AddressModel) {
    return this.post(`shop/address/delete?id=${model.id}`, {});
  }

  create(model: AddressModel) {
    if (model.id) {
      return this.post(`shop/address/update?id=${model.id}`, model);
    } else {
      return this.post(`shop/address/create`, model);
    }
  }
}
