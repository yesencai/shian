import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WechatChenyu } from "wechat-chenyu";
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { RegistCode } from '../../other/registCode'
import { Emitter } from '../../other/emitter'
import { HttpClient } from "@angular/common/http";

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

  userName;
  constructor(public navCtrl: NavController, public navParams: NavParams, public wechatChenyu: WechatChenyu, private ttConst: TTConst, private common: Common, private tomato: Tomato, private serveId: RegistCode, private http: HttpClient) {
    this.userName = navParams.get("userName");
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
    Emitter.register(this.ttConst.TT_WeChatPayNotification, this.onPayResponse, this);

  }
  //y页面将要离开
  ionViewWillUnload() {
    console.log(this + '界面销毁');
    let self = this;
    Emitter.remove(this.ttConst.TT_WeChatPayNotification, self.removeEmitter, self);
  }
  //微信支付parseInt(this.sMomney)
  weChatPay(userName: HTMLInputElement) {
    var dat = this.common.MakeHeader(this.ttConst.CLIENT_CHARGE) +
      this.common.MakeParam(this.ttConst.CLIENT_CHARGE_USERNAME, userName.value) +
      this.common.MakeParam(this.ttConst.CLIENT_CHARGE_APRICE, 0.01 * 100)
    this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serveId.getServeId(), dat);

  }

  selectMomney(event, item, index) {
    this.currentIndex = index;
    this.sMomney = item.name;
    event.stopPropagation();
  }
  onPayResponse(name, userName, orderId, price, appId, mchId, nonce, sign, prepayId, timeStame, url) {
    var params = {
      partnerid: appId, // merchant id
      prepayid: prepayId, // prepay id
      noncestr: nonce, // nonce
      timestamp: timeStame, // timestamp
      sign: sign // signed string
    };
    this.wechatChenyu.sendPaymentRequest(params).then((data) => {
      //成功之后的跳转...
    }, eoor => {
      alert(eoor);
      console.log(eoor); // Failed
    }
    );
  }
  removeEmitter() {

  }

}
