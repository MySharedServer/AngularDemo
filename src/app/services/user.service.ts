import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {

  private _userSubject = new Subject<string>();

  constructor() { }

  getUser(): Observable<string> {
    return this._userSubject.asObservable();
  }

  changeUser(user: string) {
    this._userSubject.next(user);
  }
}
