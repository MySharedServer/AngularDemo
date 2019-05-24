import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertBoxService } from './alert-box.service';
import { AlertBoxComponent } from './alert-box.component';


@NgModule({
  providers: [
    AlertBoxService,
  ],
  imports: [
    CommonModule,
  ],
  declarations: [
    AlertBoxComponent,
  ],
  exports: [AlertBoxComponent]
})
export class AlertBoxModule {
}
