// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  page_host: 'http://127.0.0.1:4200/',
  host: '/',
  // login_redirect: 'http://192.168.31.254:3500/durian/shop/user/login-demo',
  // pay_redirect: 'http://192.168.31.254:3500/durian/shop/wechat/simulate-pay',
  // pay_h5_redirect: 'http://192.168.31.254:3500/durian/shop/wechat/pay-h5',
  // alipay_pay_redirect: 'http://192.168.31.254:3500/durian/shop/alipay/pay',
  // pay_zone_redirect:'http://192.168.31.254:3500/durian/shop/wechat/pay-zone'
  login_redirect: 'http://127.0.0.1:3300/durian/shop/user/login-demo',
  pay_redirect: 'http://127.0.0.1:3300/durian/shop/wechat/simulate-pay',
  pay_h5_redirect: 'http://127.0.0.1:3300/durian/shop/wechat/pay-h5',
  alipay_pay_redirect: 'http://127.0.0.1:3300/durian/shop/alipay/pay',
  pay_zone_redirect:'http://127.0.0.1:3300/durian/shop/wechat/pay-zone'
};
