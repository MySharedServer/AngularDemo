import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowTableComponent } from './show-table.component';


@NgModule({
  providers: [
    // ShowTableService,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ShowTableComponent,
  ],
  exports: [ShowTableComponent]
})
export class ShowTableModule {
}
