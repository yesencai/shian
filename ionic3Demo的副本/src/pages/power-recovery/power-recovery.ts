import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { RegistCode } from '../../other/registCode'
import { Emitter } from '../../other/emitter'
/**
 * Generated class for the PowerRecoveryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-power-recovery',
  templateUrl: 'power-recovery.html',
})
export class PowerRecoveryPage {
  foo = true;
  switchNum;
  relay;
  deviceId;
  constructor(public navCtrl: NavController, public navParams: NavParams, public common: Common, public ttConst: TTConst, public serve: RegistCode, public tomato: Tomato) {
    this.relay = 'relayOne'
    this.switchNum = 0;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RelaycontrolPage');
    Emitter.register(this.ttConst.TT_ADDNORMALDEVECE_NOTIFICATION_NAME, this.onRelayControlResponse, this);
  }
  //y页面将要离开
  ionViewWillUnload() {
    console.log(this + '界面销毁');
    let self = this;
    Emitter.remove(this.ttConst.TT_ADDNORMALDEVECE_NOTIFICATION_NAME, self.removeEmitter, self);
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
    var dat = this.common.MakeHeader(this.ttConst.SET_SHUTDOWN_MEMORY) +
      this.common.MakeParam(this.ttConst.SET_SHUTDOWN_MEMORY_CHANNELID, relayNumber) +
      this.common.MakeParam(this.ttConst.SET_SHUTDOWN_MEMORY_MEMORY, this.switchNum)
    this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.deviceId, dat);
  }
  toggleFun() {
    this.foo = !this.foo;
    this.foo ? this.switchNum = 0 : this.switchNum = 1;
  }
  onRelayControlResponse(name, relayNumber, switchStatu) {
    this.navCtrl.pop();
  }
  removeEmitter() {

  }
}
