export class RewardModel {
  unit: string = null;
  price: string = null;
  content: string = null;
  reward_status: string = null;
  user: {
    profile: {
      nickname: null,
      thumb: null,
    }
  };
  products = [];
}
