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

  onMouseOverMinisize(obj){
    jQuery(obj).css({"color":"#65CEA7","font-weight":"bold","cursor":"pointer"});
  }

  onMouseOutMinisize(obj){
    jQuery(obj).css({"color":"white","font-weight":"normal"});
  }

  onClickMinisize(){
    jQuery("#employerprofile").stop().animate({"width":"0px"});
  }

  onMouseOverMinisizeTime(obj){
    jQuery(obj).css({"color":"#65CEA7","font-weight":"bold","cursor":"pointer"});
  }

  onMouseOutMinisizeTime(obj){
    jQuery(obj).css({"color":"white","font-weight":"normal"});
  }

  onClickMinisizeTime(){
    jQuery("#timeline").stop().animate({"height":"0px"});
  }

  onclickPrevTimeLine(){    
    var target=jQuery("#timeLineScroll");
    if(target.position().left<-200){
      target.stop().animate({"left":"+=200px"},100);  
    }else if(target.position().left!=0){
      target.stop().animate({"left":"+="+(-target.position().left)+"px"},100);
      target.addClass("inactive"); 
    }
  }

  onclickNextTimeLine(){    
    var target=jQuery("#timeLineScroll");
    var target2=jQuery("#cd-timeline");
    var delta=target.width()-target2.width()+target.position().left;
    if(delta>200){
      target.stop().animate({"left":"-=200px"},100);

    }else if(delta>0){
      target.stop().animate({"left":"-="+delta+"px"},100);
    }
    // alert(target.width());
    // if(target.position().left<-200){
    //   target.stop().animate({"left":"+=200px"},100);  
    // }else if(target.position().left!=0){
    //   target.stop().animate({"left":"+="+(-target.position().left)+"px"},100);
    //   target.addClass("inactive"); 
    // }
  }



  ngAfterViewInit() {
    this.commonService.fullScreen.subscribe(
      res => {
      openFullscreen(document.body);
      }
    );
  }
}
