import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XBackTopComponent } from './back-top.component';
import { XLinkModule } from '@ng-nest/ui/link';
import { XBackTopProperty } from './back-top.property';
import { XPortalModule } from '@ng-nest/ui/portal';

@NgModule({
  declarations: [XBackTopComponent, XBackTopProperty],
  exports: [XBackTopComponent],
  imports: [CommonModule, XLinkModule, XPortalModule]
})
export class XBackTopModule {}
