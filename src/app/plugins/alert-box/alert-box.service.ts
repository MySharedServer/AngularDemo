import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlertBoxService {

  private _alertBoxSubject = new Subject<any>();

  constructor() { }

  getAlertBox(): Observable<any> {
    return this._alertBoxSubject.asObservable();
  }

  showMsg(msgObj: any) {
    msgObj.flag = true;
    this._alertBoxSubject.next(msgObj);
  }
}
