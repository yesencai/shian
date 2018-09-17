
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { HistoryPage } from '../pages/history/history'
import { DataModule } from '../other/DataModule'
import { Storage } from '@ionic/storage'
import { TabsPage } from '../pages/tabs/tabs';
import { AppVersion } from '@ionic-native/app-version'
import { ContactPage } from '../pages/contact/contact'
import { Network } from '@ionic-native/network';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { JpushUtil } from '../other/JpushUtil';
import { JPush } from '@jiguang-ionic/jpush';
import { RegistCode } from '../other/registCode'
import { setInterval } from 'timers';
import { TTConst } from '../lib/TTConst';
import { Common } from '../lib/Common';
import { Tomato } from '../lib/tomato';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(private tomato: Tomato, private ttConst: TTConst, private common: Common, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private module: DataModule, public storage: Storage, appVersion: AppVersion, private network: Network, private toastCtrl: ToastController, private jpush: JPush, private jpushUtil: JpushUtil, private registCode: RegistCode) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.registCode.getRegitstCode();
      // //链接服务器
      this.module.onConnectClick();
      this.chooseRoot()
      document.addEventListener("resume", () => {
        statusBar.styleDefault();
        splashScreen.hide();
        module.onConnectClick();
        console.log("进入，前台展示"); //进入，前台展示
      }, false);
      document.addEventListener("pause", () => {
        console.log("退出，后台运行"); //退出，后台运行
        // module.stopConnect();
        this.jpush.setBadge(0);
      }, false);
      setTimeout(() => {
        //添加激光推送
        this.ml_jpush();
      }, 1000);

      this.newWork();
      //   if (platform.is('cordova')) {
      //     appVersion.getAppName().then((versionCode) => {
      //       this.storage.get('versionCode').then((value1) => {
      //         if (versionCode != value1) {
      //           // this.rootPage = SlidesPage;
      //           this.storage.set("versionCode", versionCode);
      //         } else {
      //           this.storage.get('loginname').then((value1) => {
      //             this.storage.get('password').then((value2) => {
      //               if (value1 && value2) {
      //                 this.rootPage = TabsPage;
      //               } else {
      //                 this.rootPage = LoginPage;
      //               }
      //             });
      //           });
      //         }
      //       });
      //     });
      //   } else {
      //     this.storage.get('loginname').then((value1) => {
      //       this.storage.get('password').then((value2) => {
      //         if (value1 && value2) {
      //           this.rootPage = TabsPage;
      //         } else {
      //           this.rootPage = LoginPage;
      //         }
      //       });
      //     });
      //   }
    });

  }
  newWork() {
    this.network.onchange().subscribe(() => {
      if (this.network.type == 'none') {
        this.codeMessage('当前没有连接网络，请检查网络设置');
      } else {
        this.codeMessage('已经切换' + this.network.type + '网络');
        this.module.onConnectClick();
      }
    });
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

  ml_jpush() {
    this.jpush.resetBadge();
    /**极光推送开启 */
    this.jpush.init();//插件初始化
    this.jpush.setDebugMode(true);
    /*消息推送配置**/
    this.jpushUtil.initPush();//监听初始化
    this.jpushUtil.setAlias(this.registCode.getDeviceName());    //设置别名
  }
  //选择根控制器
  chooseRoot() {
    this.storage.get('loginname').then((value1) => {
      this.storage.get('password').then((value2) => {
        if (value1 && value2) {
          this.rootPage = TabsPage;
          // this.login(value1,value2);
        } else {
          this.rootPage = LoginPage;
        }
      });
    });
  }

  login(username, password) {
    var dat = this.common.MakeHeader(this.ttConst.CLIENT_LOGIN) +
      this.common.MakeParam(this.ttConst.CLIENT_LOGIN_USERNAME, username) +
      this.common.MakeParam(this.ttConst.CLIENT_LOGIN_PASSWORD, password);
    var serveId = this.registCode.getServeId();
    this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, serveId, dat);
  }


}
