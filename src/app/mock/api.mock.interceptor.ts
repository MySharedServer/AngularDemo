import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { tap, mergeMap, catchError, finalize } from 'rxjs/operators';
import { LoadingService } from './../plugins/loading/loading.service';
import * as Mock from 'mockjs';
import { SqlParams, HandleWebDB } from './api.webdb';

const METHOD = {
  READ: 'GET',
  CREATE: 'POST',
  UPDATE: 'PUT',
  DELETE: 'DELETE'
};

const STATUS_e = {
  'status.400': '错误的请求。由于语法错误，该请求无法完成。',
  'status.401': '未经授权。服务器拒绝响应。',
  'status.403': '已禁止。服务器拒绝响应。',
  'status.404': '未找到。无法找到请求的位置。',
  'status.405': '方法不被允许。使用该位置不支持的请求方法进行了请求。',
  'status.406': '不可接受。服务器只生成客户端不接受的响应。',
  'status.407': '需要代理身份验证。客户端必须先使用代理对自身进行身份验证。',
  'status.408': '请求超时。等待请求的服务器超时。',
  'status.409': '冲突。由于请求中的冲突，无法完成该请求。',
  'status.410': '过期。请求页不再可用。',
  'status.411': '长度必需。未定义“内容长度”。',
  'status.412': '前提条件不满足。请求中给定的前提条件由服务器评估为 false。',
  'status.413': '请求实体太大。服务器不会接受请求，因为请求实体太大。',
  'status.414': '请求 URI 太长。服务器不会接受该请求，因为 URL 太长。',
  'status.415': '不支持的媒体类型。服务器不会接受该请求，因为媒体类型不受支持。',
  'status.416': 'HTTP 状态代码 {0}',
  'status.500': '内部服务器错误。',
  'status.501': '未实现。服务器不识别该请求方法，或者服务器没有能力完成请求。',
  'status.503': '服务不可用。服务器当前不可用(过载或故障)。'
};

@Injectable()
export class ApiMockInterceptor implements HttpInterceptor {

  private _regex: any;
  private _handleDB: HandleWebDB;

  constructor(private _loadingService: LoadingService) {
    this._handleDB = new HandleWebDB();
    this._handleDB.OpenDB();

    Mock.mock(/api/, (options: any) => this._mockFunction(options));
    this._regex = {
      'demo/detail': this._TestDB,
    };
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq: HttpRequest<any> = req.clone({
      url: req.url + '?flag=' + Date.now() // 对任意请求的url添加flag参数防止刷新
    });
    // authReq.headers.append('Content-Type', 'application/json');
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
          // console.log(tmp.params);
          // console.log(event.body);
          return this._regex[event.body].call(this, authReq.method, authReq.params, event);
        }
        return Observable.create(observer => observer.next(event)); // 请求成功返回响应
      }),
      catchError((err: HttpResponse<any>) => {
        this._loadingService.hide(0);
        // switch (err.status) {
        //   case 200:
        //     console.log('业务错误');
        //     break;
        // }
        // if (err.error instanceof Error) {

        // }
        console.error(`err.status:${err.status}---${STATUS_e[`status.${err.status}`]}`);
        // console.error(err);
        return ErrorObservable.create(err); // 请求失败处理
      }),
      finalize(() => {
        console.log('finalize');
        // 请求完成（成功或失败都执行）
        this._loadingService.hide(0);
      })
    );
  }

  private _mockFunction(options: any): string {
    let data: string;
    const reg: RegExp = new RegExp(Object.keys(this._regex).join('|'));
    options.url.replace(reg, (key: string): void => {
      data = key;
    });
    return data;
  }

  ///////////////////////////////////
  private _TestDB(method: string, params: HttpParams, event: any): Observable<any> {
    switch (method) {
      case METHOD.CREATE:
      case METHOD.DELETE:
      case METHOD.UPDATE:
        return Observable.create(observer => observer.next(event));
      case METHOD.READ:
        return this._doRead(params, event);
      default:
        return Observable.create(observer => observer.next(event));
    }
  }

  ///////////////////////////////////
  private _doRead(params: any, event: any): Observable<any> {
    // return new Promise((resolve)=>{resolve("www");});
    let tempParams: SqlParams = {};

    // params.map.forEach((value, key) => {
    //   tempParams[key] = value;
    // });
    tempParams = JSON.parse(params.map.get('params')[0]);


    return Observable.create(observer => {
      this._handleDB.QueryDB(tempParams).then(
        (response) => {
          // console.log('response:', response);
          const resp: any = {
            status: 200,
            data: response
          };
          event.body = resp;
          // TODO
          observer.next(event);
        }
      );
    });
  }
}
