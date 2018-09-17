import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanInfoPage } from './scan-info';

@NgModule({
  declarations: [
    ScanInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ScanInfoPage),
  ],
})
export class ScanInfoPageModule {}
