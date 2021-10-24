import {Observable} from 'rxjs/Observable';
import {HttpService} from './http.service';

export class RewardService extends HttpService {
  reward(param: { ids: any }): Observable<any> {
    return this.post('shop/reward/reward', param);
  }

  getReward(id): Observable<any> {
    return this.get('shop/reward/get-reward', {
      id: id
    });
  }
  getRewardByCode(code): Observable<any> {
    return this.get('shop/reward/get-reward-by-code', {
      code: code
    });
  }
  doReward(param: { id: any; content: string }): Observable<any> {
    return this.post('shop/reward/do-reward', param);
  }

  getRewards(): Observable<any> {
    return this.get('shop/reward/rewards', {});
  }

  receive(rewardId: any): Observable<any> {
    return this.get('shop/reward/receive', {
      id: rewardId
    });
  }
}
