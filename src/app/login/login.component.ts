import {Component, OnInit} from '@angular/core';
import {CommonService} from '../service/common.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
  }
}

  export class Login {
  constructor(public email: string, public password: string) {
  }
}

