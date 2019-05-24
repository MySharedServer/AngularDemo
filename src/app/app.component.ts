import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  // template: '<h1>我的第一个 Angular2 应用11</h1>'
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'Angular demo';
  userName = '';
  constructor(private  _userService: UserService) { }
  ngOnInit() {
    this._userService.getUser().subscribe(resp => {
      this.userName = resp;
    });
  }
}
