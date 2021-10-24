import {FormControl, FormGroup, Validators} from '@angular/forms';
/**
 * Created by air on 24/11/2017.
 */
export class BaseModel {
  constructor() {

  }
  get formGroup() {
    let formGroup = new FormGroup({

    });
    for (let rule of this.rules) {
      if (rule[1] === 'required') {
        for(let attribute of rule[0]) {
          if(formGroup.get(attribute) === null) {
            formGroup.addControl(attribute, new FormControl("", [
              Validators.required,
            ]))
          } else {
          }
        }
      }
    }
    return formGroup;
  }

  get rules() {
    return [];
  }
}
