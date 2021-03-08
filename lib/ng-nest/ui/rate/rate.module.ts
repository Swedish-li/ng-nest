import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XRateComponent } from './rate.component';
import { FormsModule } from '@angular/forms';
import { XButtonModule } from '@ng-nest/ui/button';
import { XRateProperty } from './rate.property';
import { XIconModule } from '@ng-nest/ui/icon';

@NgModule({
  declarations: [XRateComponent, XRateProperty],
  exports: [XRateComponent],
  imports: [CommonModule, FormsModule, XButtonModule, XIconModule]
})
export class XRateModule {}
