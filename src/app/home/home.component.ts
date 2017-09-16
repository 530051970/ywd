import {Component, OnInit} from '@angular/core';
import {CommonService} from '../service/common.service';
import {Observable} from "rxjs/Observable";
// declare const target:any; 

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
    // alert(jQuery(window).height());

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

    Observable.fromEvent(window, 'resize')
    .debounceTime(200)
    .subscribe((event) => { 
      // `${event.target.innerHeight}`
      let height0=jQuery("#header")[0].clientHeight;
      let height1=jQuery("#states-info")[0].clientHeight;
      let height2=jQuery("#middlerow")[0].clientHeight;
      let height3=jQuery("#tablesec")[0].clientHeight;
      jQuery("#leftDiv").css({height:height0+height1+height2+height3+15});
      // alert("Height:"+window.innerHeight+" width:"+window.innerWidth);
    });
  }



  

}
