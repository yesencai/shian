import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlarmHistoryRecordPage } from './alarm-history-record';

@NgModule({
  declarations: [
    AlarmHistoryRecordPage,
  ],
  imports: [
    IonicPageModule.forChild(AlarmHistoryRecordPage),
  ],
})
export class AlarmHistoryRecordPageModule {}
