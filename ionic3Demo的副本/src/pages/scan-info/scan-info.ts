import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { RegistCode } from '../../other/registCode'
import { Emitter } from '../../other/emitter'
import { RelaycontrolPage } from '../relaycontrol/relaycontrol'
import { PowerRecoveryPage } from '../power-recovery/power-recovery'
/**
 * Generated class for the ScanInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan-info',
  templateUrl: 'scan-info.html',
})
export class ScanInfoPage {
  qrcode;
  dataList = [];
  deviceId;
  show = false;
  deviceInfo = {
    deviceImg: "./assets/imgs/logo.png",
    relayOne: '无',
    relayTwo: '无',
    memoryOne: '无',
    memoryTwo: '无'
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public common: Common, public ttConst: TTConst, public serve: RegistCode, public tomato: Tomato) {
    this.qrcode = navParams.get('qrcode');
  }

  ionViewDidLoad() {
    if (this.qrcode.indexOf('www.tomato8848') == -1) {
      return;
    }
    this.dataList = [{
      title: "继电器控制",
      index: 0
    }, {
      title: "断电恢复",
      index: 1
    }, {
      title: "查询",
      index: 2
    }, {
      title: "预约",
      index: 3
    }];
    console.log('ionViewDidLoad ScanInfoPage');
    Emitter.register(this.ttConst.TT_ADDNORMALDEVECE_NOTIFICATION_NAME, this.onAddDeviceResponse, this);
    Emitter.register(this.ttConst.TT_RelayControlStatusNotification, this.onRelayStatuResponse, this);

    var index = this.qrcode.indexOf('id=');
    var deviceId = this.qrcode.substr(index + 3, this.qrcode.length);
    this.deviceId = deviceId;
    this.bingding(deviceId);
    //获取设备状态
    this.getDeviceStatu(deviceId);
  }
  //y页面将要离开
  ionViewWillUnload() {
    console.log(this + '界面销毁');
    let self = this;
    Emitter.remove(this.ttConst.TT_ADDNORMALDEVECE_NOTIFICATION_NAME, self.removeEmitter, self);
    Emitter.remove(this.ttConst.TT_RelayControlStatusNotification, self.removeEmitter, self);
  }
  /**
 * 回调函数
 */
  getData = (relayOne, relayTwo) => {
    return new Promise((resolve, reject) => {
      relayOne == '1' ? this.deviceInfo.relayOne = '开' : this.deviceInfo.relayOne = '关'
      relayTwo == '1' ? this.deviceInfo.relayTwo = '开' : this.deviceInfo.relayTwo = '关'
      resolve();
    });
  };
  select(item) {
    if (item.index == 0) {
      this.navCtrl.push(RelaycontrolPage, {
        deviceId: this.deviceId,
        callback: this.getData
      });
    } else if (item.index == 1) {
      this.navCtrl.push(PowerRecoveryPage, {
        deviceId: this.deviceId,
      })
    }

  }
  //绑定设备
  bingding(deviceId) {
    var dat = this.common.MakeHeader(this.ttConst.CLIENT_ADD_FIRST_DEVICE) +
      this.common.MakeParam(this.ttConst.CLIENT_ADD_FIRST_DEVICE_ID, deviceId) +
      this.common.MakeParam(this.ttConst.CLIENT_ADD_FIRST_DEVICE_CODE, "123456");
    this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
  }
  //获取设备状态
  getDeviceStatu(deviceId) {
    var dat = this.common.MakeHeader(this.ttConst.GET_DEVICE_DATA) +
      this.common.MakeParam(this.ttConst.GET_DEVICE_DATA_CUSTOMDATA, "deviceId");
    this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, deviceId, dat);
  }
  //添加设备成功
  onAddDeviceResponse(name, flag, msg) {
    this.show = true;
  }
  onRelayStatuResponse(name, statu, memory, time) {
    var arr = statu.split(",");
    var relayOne = arr[0];
    var relayTwo = arr[1];
    relayOne == '1' ? this.deviceInfo.relayOne = '开' : this.deviceInfo.relayOne = '关'
    relayTwo == '1' ? this.deviceInfo.relayTwo = '开' : this.deviceInfo.relayTwo = '关'

    var memoryAry = memory.split(",");
    var memoryOne = memoryAry[0];
    var memoryTwo = memoryOne[1];
    memoryOne == '1' ? this.deviceInfo.memoryOne = '开' : this.deviceInfo.memoryOne = '关'
    memoryTwo == '1' ? this.deviceInfo.memoryTwo = '开' : this.deviceInfo.memoryTwo = '关'
  }
  removeEmitter() {

  }

}
