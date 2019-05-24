import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoadingService {

  private _loadingSubject: Subject<boolean> = new Subject<boolean>();
  private _loadingCount: number;

  constructor() {
    this._loadingCount = 0;
  }

  get LoadingCount(): number {
    return this._loadingCount;
  }

  set LoadingCount(count: number) {
    this._loadingCount = count;
  }

  getLoding(): Observable<boolean> {
    return this._loadingSubject.asObservable();
  }

  show(): void {
    console.log('show _loadingCount:' + this.LoadingCount);
    if (this.LoadingCount === 0) {
      this._loadingSubject.next(true);
    }
    this.LoadingCount++;
  }

  hide(count?: number): void {
    this.LoadingCount--;
    if (this.LoadingCount <= 0 || count === 0) {
      this.LoadingCount = 0;
      this._loadingSubject.next(false);
    }
    console.log('hide _loadingCount:' + this.LoadingCount);
  }
}
