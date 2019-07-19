import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TableHead } from './show-table.model';

@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.less']
})

export class ShowTableComponent implements OnChanges {

  @Input() tableHeads: TableHead[];
  @Input() dataList: any[];
  @Output() trEventEmit: any = new EventEmitter();
  @Output() exportEventEmit: any = new EventEmitter();

  private displayPageSize: number = 5;
  public tableList: any[] = [];
  public curPageData: any = [];
  public displayRowSize: number = 20;
  public displayPageList: number[] = [];
  public curPage: number;
  public inputPage: number = 1;
  public displayPageArr: number[];

  constructor() {
    this.displayPageArr = [
      5, 10, 15, 20
    ];
  }

  ngOnChanges() {
    this.tableList = this.dataList.slice(0);
    this.selectPage(1);
  }

  public getPageCount(): number {
    return this.tableList && this.tableList.length ? Math.ceil(this.tableList.length / this.displayRowSize) : 0;
  }

  private setCurPageData(): void {
    this.curPageData = this.tableList && this.tableList.length ? this.tableList.slice((this.displayRowSize * (this.curPage - 1)), (this.curPage * this.displayRowSize)) : [];
    let filterLength: number = this.curPageData.length;
    for (let i: number = 0; i < this.displayRowSize - filterLength; i++) {
      this.curPageData.push({});
    }
  }

  public getObjKeys(obj: any): Array<any> {
    let keys: Array<string> = Object.keys(obj);
    if (keys.length > 0) {
      return keys;
    }
    return Object.keys(this.tableHeads);
  }

  public selectPage(page: number): void {
    let pageCount = this.getPageCount();
    if (pageCount === 0) {
      this.curPage = 0;
      this.displayPageList = [];
      this.setCurPageData();
      return;
    }
    if (page < 1 || page > pageCount) { return; }

    let newpageList: number[] = [];
    let i: number;
    if (pageCount < this.displayPageSize) {
      for (i = 0; i < pageCount; i++) {
        newpageList.push(i + 1);
      }
    } else if (page <= Math.ceil(this.displayPageSize / 2)) {
      for (i = 0; i < this.displayPageSize; i++) {
        newpageList.push(i + 1);
      }
    } else if (page > pageCount - Math.ceil(this.displayPageSize / 2)) {
      for (i = pageCount - this.displayPageSize; i < pageCount; i++) {
        newpageList.push(i + 1);
      }
    } else {
      for (i = (page - Math.ceil(this.displayPageSize / 2)); i < page + Math.floor(this.displayPageSize / 2); i++) {
        newpageList.push(i + 1);
      }
    }
    this.displayPageList = newpageList;

    this.curPage = page;
    this.setCurPageData();
    setTimeout(_ => {
      $('[data-toggle="tooltip"]').tooltip();
    }, 0);
    console.log(`main-table selectPage: ${page}`);
  }

  public isCurPage(page: number): boolean {
    return this.curPage === page;
  }

  public pageTurner(type: string): void {
    let page: number;
    switch (type) {
      case 'prePage':
        page = this.curPage - 1;
        break;
      case 'nextPage':
        page = this.curPage + 1;
        break;
      case 'firstPage':
        page = 1;
        break;
      case 'lastPage':
        page = this.getPageCount();
        break;
    }
    this.selectPage(page);
  }

  public displayPageChange(page: number): void {
    this.displayRowSize = page;
    this.pageTurner('firstPage');
  }

  public trClick(obj: any): void {
    if (this.trEventEmit.observers.length > 0) {
      this.trEventEmit.emit(obj);
    }
  }

  public exportClick(): void {
    this.exportEventEmit.emit();
  }
}
