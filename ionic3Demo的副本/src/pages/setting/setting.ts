import { Component } from '@angular/core';
import { IonicPage, App,NavController, NavParams, Events, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { PersonPage } from '../person/person';
import { ChangePswPage } from '../change-psw/change-psw';
import { ResetPswPage } from '../reset-psw/reset-psw';
import { AboutPage } from '../about/about';
import { DevicePage } from '../device/device';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
import { Storage } from '@ionic/storage'
import { RegistCode } from '../../other/registCode'
import { WeChatPayPage } from '../we-chat-pay/we-chat-pay'
import { LoginPage } from '../login/login'

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html',
})

export class SettingPage {

	headimage: string = "./assets/imgs/logo.png";
	name: string = "未填写";
	mobile;
	monney = 0;
	timeout;
	deviceName;
	constructor(private app:App, private registCode : RegistCode, public serve: RegistCode, public navCtrl: NavController, public navParams: NavParams, public events: Events, public alerCtrl: AlertController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato, public toastCtrl: ToastController, public storage: Storage) {
		let self = this;
		Emitter.register(this.ttConst.TT_EXIT_NOTIFICATION_NAME, self.onExitResponse, self);
		Emitter.register(this.ttConst.TT_GetPersonInfoNotification, self.onGetPersonInfo, self);
		this.storage.get('loginname').then((value) => {
			this.mobile = value;
		});
		this.deviceName = this.registCode.getDeviceName();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingPage');
		this.getPersonInfo();
	}

	//y页面将要离开
	ionViewWillUnload() {
		console.log(this + '界面销毁');
		let self = this;
		Emitter.remove(this.ttConst.TT_EXIT_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_GetPersonInfoNotification, self.removeEmitter, self);
	}
	logOut() {
		this.doConfirm();
	}
	getData = (data) => {
		return new Promise((resolve, reject) => {
			this.name = data;
			resolve();
		});
	};
	seleteItem(index) {
		if (index == 1) {
			this.navCtrl.push(PersonPage, {
				callback: this.getData,
				headimage: this.headimage,
				name: this.name,
				mobile: this.mobile

			});
		} else if (index == 2) {
			this.navCtrl.push(ChangePswPage);
		} else if (index == 3) {
			this.navCtrl.push(ResetPswPage);
		} else {
			this.navCtrl.push(AboutPage);
		}
	}
	doConfirm() {
		let confirm = this.alerCtrl.create({
			title: '退出登录',
			message: '确定退出登录?',
			buttons: [
				{
					text: '取消',
					handler: () => {
						console.log('Disagree clicked');
					}
				},
				{
					text: '同意',
					handler: () => {
						this.timeout = setTimeout(() => {
							this.onExitResponse;
						}, 3000);
						this.common.showLoading("正在退出登录...");
						var dat = this.common.MakeHeader(this.ttConst.CLIENT_LOGOFF);
						this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
					}
				}
			]
		});
		confirm.present()
	}
	//退出成功后的回调
	onExitResponse(name, flag, msg) {
		clearTimeout(this.timeout);
		this.common.hideLoading();
		this.storage.set("password", undefined);
		this.events.publish('toLogin');

	}
	
	//充值
	charged(item) {
		this.navCtrl.push(WeChatPayPage, {
			userName: this.mobile
		});
	}
	//获取用户信息
	getPersonInfo() {
		setTimeout(() => {
			var dat = this.common.MakeHeader(this.ttConst.CLIENT_GETINFO) +
				this.common.MakeParam(this.ttConst.CLIENT_GETINFO_USERNAME, this.mobile);
			this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
		}, 1000);

	}
	removeEmitter(dd) {

	}
	onGetPersonInfo(name, balance, nickeName, headImage, sex) {
		this.name = nickeName;
		this.monney = parseInt(balance) / 100;
	}

}
