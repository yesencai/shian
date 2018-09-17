import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { WechatChenyu } from "wechat-chenyu";

/**
 * Generated class for the WeChatPayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
@Component({
  selector: 'page-we-chat-pay',
  templateUrl: 'we-chat-pay.html',
})
export class WeChatPayPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  momney = [];
  currentIndex = 0;
  sMomney: string = '10'
  omonney;
  ionViewDidLoad() {
    console.log('ionViewDidLoad WeChatPayPage');
    this.momney = [
      {
        name: '10',
      },
      {
        name: '20',
      }, {
        name: '30',
      }, {
        name: '50',
      }, {
        name: '100',
      }, {
        name: '200',
      }
    ]
  }

  //微信支付
  weChatPay() {
    alert(this.sMomney);
    var params = {
      partnerid: "10000100", // merchant id
      prepayid: "wx201411101639507cbf6ffd8b0779950874", // prepay id
      noncestr: "1add1a30ac87aa2db72f57a2375d8fec", // nonce
      timestamp: "1439531364", // timestamp
      sign: "0CB01533B8C1EF103065174F50BCA001" // signed string
    };

    // this.wechatChenyu.sendPaymentRequest(params).then((data) => {
    //   //成功之后的跳转...
    // }, eoor => {
    //   alert(eoor);
    //   console.log(eoor); // Failed
    // }
    // );

  }

  selectMomney(event, item, index) {
    this.currentIndex = index;
    this.sMomney = item.name;
    event.stopPropagation();
  }

}
