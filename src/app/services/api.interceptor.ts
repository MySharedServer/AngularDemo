import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { tap, mergeMap, catchError, finalize } from 'rxjs/operators';
import { LoadingService } from './../plugins/loading/loading.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private _loadingService: LoadingService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq: HttpRequest<any> = req.clone({
      url: req.url + '?flag=' + Date.now()
    });
    return next.handle(authReq).pipe(
      tap(res => {
        if (res && res.type === 0) {
          this._loadingService.show();
        }
      }),
      mergeMap((event: any) => {
        if (event instanceof HttpResponse && event.status !== 200) {
          console.error('mergeMap error;');
          return ErrorObservable.create(event);
        }
        if (event.status === 200) {
          this._loadingService.hide();
        }
        return Observable.create(observer => observer.next(event));
      }),
      catchError((err: HttpResponse<any>) => {
        // console.error(`err.status:${err.status}---${STATUS_e[`status.${err.status}`]}`);
        console.error(err);
        return ErrorObservable.create(err);
      }),
      finalize(() => {
        console.log('finalize');
        this._loadingService.hide(0);
      })
    );
  }
}
