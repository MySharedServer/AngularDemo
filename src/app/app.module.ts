import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { RouterModule, Routes } from '@angular/router';

import { Logger } from './common/util';
import { AppComponent } from './app.component';
import { ApiMockInterceptor } from './mock/api.mock.interceptor';
import { ApiInterceptor } from './services/api.interceptor';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { Component_A } from './components/Component_A.component';
import { Component_B } from './components/Component_B.component';

import { AlertBoxModule } from './plugins/alert-box/alert-box.module';
import { LoadingModule } from './plugins/loading/loading.module';

const routes: Routes = [
  { path: '', component: Component_A },
  { path: 'search', component: Component_B },
];

@NgModule({
  declarations: [
    AppComponent,
    // Component_A,
    // Component_B,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxEchartsModule,
    RouterModule.forRoot(routes),  // 路由

    AlertBoxModule,
    LoadingModule,
  ],
  providers: [
    Logger,
    ApiService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiMockInterceptor, multi: true }
    // { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule], // 路由
})
export class AppModule { }
