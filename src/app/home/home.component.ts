import {Component, OnInit} from '@angular/core';
import {CommonService} from '../service/common.service';
import {Observable} from "rxjs/Observable";
import {openFullscreen} from "../utils/common.utils";
// import nicescroll from 'jquery.nicescroll';
// declare interface JQuery<HTMLElement>{
//   const niceScroll: any;
// }
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public ts:JQuery<HTMLElement>;
  
  private fullscreen:string = "0";
  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    // jQuery(".left-side").add(".main-content").add(".sticky-header").add("html").niceScroll({
    //   styler: "fb",
    //   cursorcolor: "#65cea7",
    //   cursorwidth: '3',
    //   cursorborderradius: '0px',
    //   background: '#424f63',
    //   spacebarenabled: false,
    //   cursorborder: '0'
    // });
  }

  ngAfterViewInit() {
    this.commonService.fullScreen.subscribe(
      res => {
      openFullscreen(document.body);
      }
    );
  }
}
