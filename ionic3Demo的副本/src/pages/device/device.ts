import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Alert } from 'ionic-angular';
import { DeviceInfoPage } from '../device-info/device-info';
import { NormalDevicePage } from '../normal-device/normal-device';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { RegistCode } from '../../other/registCode'
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { PopoverPage } from '../popover/popover'
import { ScanPage } from '../scan/scan'
import { ScanInfoPage } from '../scan-info/scan-info'
import { variable } from "../util/globalVariable";
import { WifiDevicePage } from "../wifi-device/wifi-device"

/**
 * Generated class for the DevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-device',
	templateUrl: 'device.html',
})


export class DevicePage {
	@ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
	@ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
	showGreeting: Boolean = false;
	listData = [];
	testArray: string[] = ['在线设备', '离线设备'];
	testSegment: string = this.testArray[0];
	device;
	deviceOnline: boolean; //判断设备是否在线。
	applicationInterval: any;
	deviceStatu: any
	public billCode: string = "";
	public isCheck: boolean = false;
	list;
	isGoing = false;
	constructor(public serve: RegistCode, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato, public alerCtrl: AlertController, public popoverCtrl: PopoverController) {

	}
	ionViewDidLoad() {
		let self = this;
		Emitter.register(this.ttConst.TT_GETDEVICELIST_NOTIFICATION_NAME, self.onGetDeviceListResponse, self);
		Emitter.register(this.ttConst.TT_ADDALARM_NOTIFICATION_NAME, self.onAddLanrmingDeviceResponse, self);
		Emitter.register(this.ttConst.TT_MQTTCONNET_NOTIFICATION_NAME, self.mqttOnConnet, self);
		Emitter.register(this.ttConst.TT_DEVICEOFFLINE_NOTIFICATION_NAME, self.onDeviceOffLineResponse, self);
		Emitter.register(this.ttConst.TT_HOMEPROTECTION_NOTIFICATION_NAME, self.onHomeProtectionDeviceResponse, self);
		Emitter.register(this.ttConst.TT_AddDeviceNotification, self.addDeviceNotifa, self);
		Emitter.register(this.ttConst.TT_CancelPoliceNotification, self.cancelPoliceNotifa, self);
		Emitter.register(this.ttConst.TT_ScanningDeviceNotification, self.scanningPoliceNotifa, self);
		Emitter.register(this.ttConst.TT_CLLPHONE_NOTIFICATION_NAME, self.updateStatus, self);

		console.log('ionViewDidLoad DevicePage');
		setTimeout(() => {
			this.listData.splice(0, this.listData.length);
			this.getDeviceList();
			this.isGoing = true;
		}, 1000);
		this.showAdddDevieButton()
	}

	//y页面将要离开
	ionViewWillUnload() {
		console.log(this + '界面销毁');
		let self = this;
		Emitter.remove(this.ttConst.TT_CLLPHONE_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_GETDEVICELIST_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_HOMEPROTECTION_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_MQTTCONNET_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_ADDALARM_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_DEVICEOFFLINE_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_AddDeviceNotification, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_CancelPoliceNotification, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_ScanningDeviceNotification, self.removeEmitter, self);

	}
	updateStatus(name, deviceId) {
		if (deviceId == undefined) {
			return;
		}
		this.listData.forEach(element => {
			if (element.deviceId == deviceId) {
				element.deviceOnline = 'Online';
				element.onlineStype = '在线';
			}
		});
	}
	//获取设备列表
	getDeviceList() {
		var dat = this.common.MakeHeader(this.ttConst.CLIENT_GET_FIRST_DEVICE)
		this.common.SendLearStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
	}

	/**
	* 回调函数
	*/
	getData = (data) => {
		return new Promise((resolve, reject) => {
			this.listData.push({
				deviceImg: "./assets/imgs/logo.png",
				electricity: "90%",
				deviceMode: "",
				title: "",
				phoneNumber1: "",
				phoneNumber2: "",
				deviceId: data,
				count: "",
				protectionState: "其他布防",
				onlineState: "Online",
				onlineStype: "在线",
				address: "",
				deviceAlarmStat: ""
			});
			this.showAdddDevieButton();
			resolve();
		});
	};

	//搜索添加设备
	addDevice() {
		this.navCtrl.push(NormalDevicePage, {
			callback: this.getData
		});
		this.showAdddDevieButton();

	}
	/**
	 * 回调函数
	 */
	deleteDevice = () => {
		return new Promise((resolve, reject) => {
			this.showAdddDevieButton();
			resolve();
		});
	};
	//跳转设备详情页面
	deviceInfo(item) {
		this.navCtrl.push(DeviceInfoPage, {
			deviceInfo: item,
			deviceList: this.listData,
			callback: this.deleteDevice
		});
	}
	//判断是否显示添加设备按钮
	showAdddDevieButton() {
		this.showGreeting = this.listData.length == 0;
	}
	//撤防
	removal(event, item) {
		this.common.showLoading("撤防中...");
		this.deviceOnline = true;
		this.device = item;
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "0");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "0");
		this.deviceStatu = "撤防";

	}
	//外出布防
	outProtection(event, item) {
		this.common.showLoading("布防中...");
		this.deviceOnline = true;
		this.device = item;
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "2");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "2");
		this.deviceStatu = "外出布防";


	}
	//在家布防
	homeProtection(event, item) {
		this.common.showLoading("布防中...");
		this.deviceOnline = true;
		this.device = item;
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "1");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "1");
		this.deviceStatu = "在家布防";

	}

	//获取设备列表
	onGetDeviceListResponse(name,
		deviceId,
		deviceMode,
		deviceOnline,
		deviceStat,
		deviceName,
		deviceNotifyalarmPhone1,
		deviceNotifyalarmPhone2,
		deviceNotifyalarmMode,
		deviceNotifyalarm,
		deviceNumber, deviceAddress, deviceAlarmStat) {
		var onlineStype;
		if (deviceOnline == 'Online') {
			onlineStype = '在线'
		} else {
			onlineStype = '离线';
		}
		if (deviceStat == '1') {
			deviceStat = '在家布防';
		} else if (deviceStat == '0') {
			deviceStat = '撤防';
		} else if (deviceStat == '2') {
			deviceStat = '外出布防';
		} else {
			deviceStat = '其他布防';
		}
		this.listData.push({
			deviceImg: "./assets/imgs/logo.png",
			electricity: "90%",
			deviceMode: deviceMode,
			title: deviceName,
			phoneNumber1: deviceNotifyalarmPhone1,
			phoneNumber2: deviceNotifyalarmPhone2,
			deviceId: deviceId,
			count: deviceNumber,
			protectionState: deviceStat,
			onlineState: deviceOnline,
			onlineStype: onlineStype,
			address: deviceAddress,
			model: deviceNotifyalarmMode,
			time: deviceNotifyalarm,
			deviceAlarmStat: deviceAlarmStat
		});
		this.showAdddDevieButton();

	}
	//设置布防回调
	onHomeProtectionDeviceResponse(name, flag, msg) {
		if (this.device === undefined) {
			return;
		}
		this.common.hideLoading();
		this.deviceOnline = false;
		//停止定时器
		clearTimeout(this.applicationInterval);
		if (flag == '1') {
			for (let index = 0; index < this.listData.length; index++) {
				var element = this.listData[index];
				if (element.deviceId == this.device.deviceId) {
					this.device.protectionState = this.deviceStatu;
					element.deviceOnline = 'Online';
					element.onlineStype = '在线';
				}
			}
		} else {
			this.codeMessage(msg)
		}
	}

	//获取验证码后的提示信息，失败或成功
	codeMessage(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 2000,
			position: "top"
		});
		toast.present();
	}
	//mqtt链接成功
	mqttOnConnet() {
		if (this.isGoing) {
			//获取设备列表
		this.listData.splice(0, this.listData.length);
		this.getDeviceList();
		}
	
	}
	removeEmitter(dd) {

	}

	doRefresh(refresher) {
		// this.getDeviceList();
		setTimeout(() => {
			console.log('加载完成后，关闭刷新');
			refresher.complete();
		}, 2000);
	}

	//定时器设置链接服务器，通知设备
	Timeout(deviceInfo, count) {
		this.applicationInterval = setTimeout(() => {
			this.device = deviceInfo;
			//设备不在线
			var dat = this.common.MakeHeader(this.ttConst.CLIENT_SETNOTIFYALARM) +
				this.common.MakeParam(this.ttConst.CLIENT_SETNOTIFYALARM_DEVICEID, deviceInfo.deviceId) +
				this.common.MakeParam(this.ttConst.CLIENT_SETNOTIFYALARM_DEFENSE, count);
			this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
		}, 8000);
	}

	onAddLanrmingDeviceResponse(name, flag, msg) {
		if (flag == '1') {
			this.codeMessage("设置成功")
		} else {
			this.codeMessage(msg)
		}

	}
	//设备离线的时候预警
	onDeviceOffLineResponse(name, flag, msg) {
		window.clearTimeout(this.applicationInterval);
		this.codeMessage(msg)
		if (this.device.onlineState === 'offLine') {
			return;
		}
		for (let index = 0; index < this.listData.length; index++) {
			var element = this.listData[index];
			if (element.deviceId == this.device.deviceId) {
				element.deviceOnline = 'offLine';
				element.onlineStype = '离线';
			}
		}
	}

	presentPopover(ev) {
		let popover = this.popoverCtrl.create(PopoverPage, {
			contentEle: "this.content.nativeElement",
			textEle: "this.text.nativeElement"
		});

		popover.present({
			ev: ev
		});
	}
	addDeviceNotifa(name) {
		this.addDevice();
	}

	cancelPoliceNotifa(name) {
		if (this.common.deviceid == undefined) {
			this.listData.forEach(element => {
				if (element.deviceAlarmStat == '1') {
					this.common.deviceid = element.deviceId;
				}
			})
		}
		if (this.common.deviceid == undefined) {
			this.codeMessage('没有设备发生报警');
			return;
		}
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "10");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.common.deviceid, dat);
	}
	// scanningPoliceNotifa() {
	// 	variable.isSweep = false;
	// 	this.navCtrl.push(ScanPage);
	// }
	//配置WIFI
	scanningPoliceNotifa() {
		this.navCtrl.push(WifiDevicePage);
	}

}
