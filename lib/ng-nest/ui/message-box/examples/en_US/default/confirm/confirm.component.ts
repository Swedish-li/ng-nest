import { Component } from '@angular/core';
import { XMessageBoxService, XMessageBoxAction } from '@ng-nest/ui/message-box';
import { XMessageService } from '@ng-nest/ui/message';

@Component({
  selector: 'ex-confirm',
  templateUrl: './confirm.component.html'
})
export class ExConfirmComponent {
  constructor(private msgBox: XMessageBoxService, private message: XMessageService) {}
  confirm() {
    this.msgBox.confirm({
      title: 'prompt',
      content: 'This operation will permanently delete this piece of data, do you want to continue?',
      type: 'warning',
      callback: (action: XMessageBoxAction) => {
        if (action === 'confirm') {
          // Business processing......
          this.message.success('successfully deleted!');
        } else {
          this.message.info('Undeleted!');
        }
      }
    });
  }
}
