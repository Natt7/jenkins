declare var $: any;

export class UIService {
  toast(content: string) {
    $.fancybox.open(content, {
      'autoSize': true,
      tpl: {
        wrap: '<div class="fancybox-wrap fancybox-wrap-dialog" tabIndex="-1">' +
        '<div class="fancybox-skin" style="position: relative">' +
          '<div class="fancybox-outer">' +
            '<div class="fancybox-inner"></div>' +
            //'<div style="width: 100%;height: 50px;background: red;text-align: center;line-height: 50px;" (click)="alert()">确认</div>'+
            //'<div style="width: 110.5%;height: 50px;background: red;text-align: center;line-height: 50px;position: absolute;left:-15px;bottom:-15px">确认</div>'+
          '</div>' +
        '</div>' +
        '</div>',
        //wrap:''
      },
    });
    //setTimeout(function () {
    //  $.fancybox.close();
    //}, 2000)
  }
}
