import { NgModule, CUSTOM_ELEMENTS_SCHEMA ,NO_ERRORS_SCHEMA ,ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage'
import { Device } from '@ionic-native/device';


import { PopoverPage } from '../pages/popover/popover'
import { DevicePage } from '../pages/device/device';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { RegisteredPage } from '../pages/registered/registered';
import { SettingPage } from '../pages/setting/setting';
import { PersonPage } from '../pages/person/person';
import { ChangePswPage } from '../pages/change-psw/change-psw';
import { ResetPswPage } from '../pages/reset-psw/reset-psw';
import {Camera} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import {AboutPage} from '../pages/about/about';
import {DeviceInfoPage} from '../pages/device-info/device-info';
import {AlarmPage} from '../pages/alarm/alarm';
import {HistoryPage} from '../pages/history/history';
import {AddDevicePage} from '../pages/add-device/add-device';
import {AlarmNumberPage} from '../pages/alarm-number/alarm-number';
import { Tomato } from '../lib/tomato'
import { Common } from '../lib/Common'
import { TTConst } from '../lib/TTConst'
import { DataModule } from '../other/DataModule'
import { BackButtonProvider } from '../other/back-button-provider'
import { NormalDevicePage } from '../pages/normal-device/normal-device'
import { WifiDevicePage } from '../pages/wifi-device/wifi-device'
import { CalendarModule } from "ion2-calendar";
import { ChildDevicePage } from '../pages/child-device/child-device'
import { websocket } from '../lib/websocket'
import { EditorChildDevicePage } from '../pages/editor-child-device/editor-child-device'
import { AppVersion} from "@ionic-native/app-version";
import { ChooseDevicePage } from '../pages/choose-device/choose-device'
import { RegistCode } from '../other/registCode'
import { SencondDeviceInfoPage }from '../pages/sencond-device-info/sencond-device-info'
import { WeChatPayPage }from '../pages/we-chat-pay/we-chat-pay'
import { WechatChenyu } from "wechat-chenyu";

@NgModule({
	
  declarations: [
    MyApp,
    EditorChildDevicePage,
    ChildDevicePage,
    LoginPage,
    AlarmNumberPage,
    AboutPage,
    ResetPswPage,
    RegisteredPage,
    AlarmPage,
    SettingPage,
    ChangePswPage,
    DeviceInfoPage,
    DevicePage,
    PopoverPage,
    WeChatPayPage,
    SencondDeviceInfoPage,
    TabsPage,
    PersonPage,
    HistoryPage,
    AddDevicePage,
    NormalDevicePage,
    WifiDevicePage,
    ChooseDevicePage
  ],
  imports: [
    BrowserModule,
    CalendarModule,
    IonicModule.forRoot(MyApp,{
    tabsHideOnSubPages: 'true',
    backButtonText: '',//按钮内容
    backButtonIcon: 'arrow-dropleft-circle',//按钮图标样式
    }),
    IonicStorageModule.forRoot(),

  ],
  bootstrap: [IonicApp],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  entryComponents: [
    MyApp,
    EditorChildDevicePage,
    ChildDevicePage,
    AlarmNumberPage,
    DeviceInfoPage,
    LoginPage,
    AlarmPage,
    AboutPage,
    ResetPswPage,
    WeChatPayPage,
    SencondDeviceInfoPage,
    RegisteredPage,
    SettingPage,
    ChangePswPage,
    DevicePage,
    TabsPage,
    PopoverPage,
    PersonPage,
    HistoryPage,
    AddDevicePage,
    NormalDevicePage,
    WifiDevicePage,
    ChooseDevicePage
  ],
  providers: [
    StatusBar,
    WechatChenyu,
    AppVersion,
    Camera,
    Device,
    ImagePicker,
    SplashScreen,
    Tomato,
    RegistCode,
    websocket,
    Common,
    DataModule,
    BackButtonProvider,
    TTConst,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {

}
