import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { RegistCode } from '../../other/registCode'
import { Emitter } from '../../other/emitter'
/**
 * Generated class for the RelaycontrolPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-relaycontrol',
  templateUrl: 'relaycontrol.html',
})
export class RelaycontrolPage {

  foo = true;
  switchNum;
  relay;
  deviceId;
  callback;
  constructor(public navCtrl: NavController, public navParams: NavParams, public common: Common, public ttConst: TTConst, public serve: RegistCode, public tomato: Tomato) {
    this.relay = 'relayOne'
    this.switchNum = 0;
    this.deviceId = navParams.get('deviceId');
    this.callback   = this.navParams.get('callback');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RelaycontrolPage');
    Emitter.register(this.ttConst.TT_RelayControlNotification, this.onRelayControlResponse, this);
  }
  //y页面将要离开
  ionViewWillUnload() {
    console.log(this + '界面销毁');
    let self = this;
    Emitter.remove(this.ttConst.TT_RelayControlNotification, self.removeEmitter, self);
  }
  saveSetting() {
    var relayNumber;
    if (this.relay == 'relayOne') {
      relayNumber = '1'
    } else if (this.relay == 'relayTwo') {
      relayNumber = '2'
    } else {
      relayNumber = '0'
    }
    var dat = this.common.MakeHeader(this.ttConst.CTRL_DEVICE) +
      this.common.MakeParam(this.ttConst.CTRL_DEVICE_CHANNELID, relayNumber) +
      this.common.MakeParam(this.ttConst.CTRL_DEVICE_ACTION, this.switchNum)+
      this.common.MakeParam(this.ttConst.CTRL_DEVICE_DELAYTIME, 0);

      this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.deviceId, dat);
  }
  toggleFun() {
    this.foo = !this.foo;
    this.foo ? this.switchNum = 0 : this.switchNum = 1;
  }
  onRelayControlResponse(name, relayNumber) {
    var arr = relayNumber.split(",");
    var relayOne = arr[0];
    var relayTow = arr[1];
    this.callback(relayOne,relayTow).then(()=>{ this.navCtrl.pop() });

  }
  removeEmitter() {

  }

}
