import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less']
})

export class LoadingComponent implements OnInit {

  public showLoading: boolean = false; // 是否显示loading
  constructor(private _loadingService: LoadingService) { }

  ngOnInit() {
    this._loadingService.getLoding().subscribe(loading => {
      this.showLoading = loading;
    });
  }
}
