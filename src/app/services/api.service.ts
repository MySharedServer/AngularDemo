import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { Logger } from './../common/util';
import { AlertBoxService } from './../plugins/alert-box/alert-box.service';
import { UserService } from './user.service';

declare var environment: any;

@Injectable()
export class ApiService {

  constructor(private _http: HttpClient, private _logger: Logger,
    private _alertBoxService: AlertBoxService, private _userService: UserService) { }

  postMethod(url: string, params: HttpParams, body: any): Observable<any> {
    const options = {
      params
    };
    return this._http.post(url, body, options).pipe(
      tap(_ => this._logger.log(`${url}: added params=${JSON.stringify(params)}`)),
      catchError(this._handleError<any>(`add: ${url}`))
    );
  }

  deleteMethod(url: string, params: HttpParams): Observable<any> {
    const options = {
      params
    };
    return this._http.delete(url, options).pipe(
      tap(_ => this._logger.log(`${url}: deleted params=${JSON.stringify(params)}`)),
      catchError(this._handleError<any>(`delete: ${url}`))
    );
  }

  updateMethod(url: string, params: HttpParams, body: any): Observable<any> {
    const options = {
      params
    };
    return this._http.put(url, body, options).pipe(
      tap(_ => this._logger.log(`${url}: updated params=${JSON.stringify(params)}`)),
      catchError(this._handleError<any>(`update: ${url}`))
    );
  }

  getMethod(url: string, params: any): Observable<any> {
    const options = {
      params
    };
    return this._http.get(url, options).pipe(
      tap(_ => this._logger.log(`${url}: found matching "${JSON.stringify(params)}"`)),
      catchError(this._handleError<any[]>(`search: ${url}`, []))
    );
  }

  GetTestData(tempParams: any): Promise<any> {
    this._logger.log(`params: ${JSON.stringify(tempParams)}`);
    let msgObj: any = {
      title: '',
      msg: ''
    };
    let showMsg: boolean = false;
    return new Promise((resolve, reject) => {
      this.getMethod(environment.apiURL.test, { params: JSON.stringify(tempParams) })
        .subscribe(resp => {
          this._logger.log(`resp: ${JSON.stringify(resp)}`);
          // const data: any = JSON.parse(resp);

          if (resp) {
            switch (resp.result) {
              case 100:
                // Please use chrome browser open.
                showMsg = true;
                msgObj.msg = 'Please use chrome browser open.';
                break;
              case 102:
                // current time empty data
                showMsg = true;
                msgObj.msg = 'No data match your query conditions.';
                break;
              case 301:
                // no permission
                showMsg = true;
                msgObj.msg = 'You may do not have permission to access oracle database.';
                break;
              default:
                if (resp.data && resp.data.length > 0) {
                  resolve(resp);
                } else {
                  showMsg = true;
                  msgObj.msg = 'No data match your query conditions.';
                }
                break;
            }
            if (resp.username) {
              this._userService.changeUser(resp.username);
            }
          }
          if (showMsg) {
            this._alertBoxService.showMsg(msgObj);
            this._logger.error(msgObj.msg);
            reject();
          }
        }, error => {
          msgObj.msg = 'Request parameter error.';
          this._alertBoxService.showMsg(msgObj);
          this._logger.error(error);
          reject(error);
        });
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private _handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      this._logger.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this._logger.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
