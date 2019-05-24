import { Component, OnInit } from '@angular/core';
import { AlertBoxService } from './alert-box.service';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.less']
})
export class AlertBoxComponent implements OnInit {
  modalFlag: boolean;
  msgObj: any;
  constructor(private _alertBoxService: AlertBoxService) {
    // this.modalFlag = true;
    this.msgObj = {
      // title: 'Modal title',
      title: 'Alert',
      msg: 'Modal body text goes here.',
    };
  }

  ngOnInit() {
    this._alertBoxService.getAlertBox().subscribe(resp => {
      this.modalFlag = resp.flag;
      this.msgObj.msg = resp.msg;
    });
  }

  closeMessage(): void {
    this.modalFlag = false;
  }
}
