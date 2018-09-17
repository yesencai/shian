import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeChatPayPage } from './we-chat-pay';

@NgModule({
  declarations: [
    WeChatPayPage,
  ],
  imports: [
    IonicPageModule.forChild(WeChatPayPage),
  ],
})
export class WeChatPayPageModule {}
