// 导入enableProdMode用来关闭angular开发者模式
import { enableProdMode } from '@angular/core';
// 负责从angular浏览器模块中导入platformBrowserDynamic这个方法，
// 这个方法告诉angular使用哪个模块来启动整个应用
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// 整个应用的主模块
import { AppModule } from './app.module';
// angular多环境支持
import { environment } from './../environments/environment';

(<any>window).environment = environment;
if (environment.production) {
  // 切换开发模式和生产模式，ng build命令是否带“--prod”
  // 如果是工厂模式，就启动enableProdMode来关闭开发者模式
  enableProdMode();
}

// 调用bootstrapModule方法来传入AppModule作为启动模块来启动应用。返回的是延迟对象（Promise）
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
