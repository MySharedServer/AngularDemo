import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from './loading.service';
import { LoadingComponent } from './loading.Component';


@NgModule({
  providers: [
    LoadingService,
  ],
  imports: [
    CommonModule,
  ],
  declarations: [
    LoadingComponent,
  ],
  exports: [LoadingComponent]
})
export class LoadingModule {
}
