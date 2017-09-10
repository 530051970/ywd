import {Component, OnInit} from '@angular/core';
import {CommonService} from '../service/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  private fullscreen:string = "0";
  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    // this.commonService.showDateAndTime();

  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.commonService.fullScreen.subscribe(
      res => {this.fullscreen = res;
        // alert(this.fullscreen);
         var element=document.body;
        if (element.requestFullscreen) {
          element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
      } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen();
      }
      
      
      }
    );
  }

  

}
