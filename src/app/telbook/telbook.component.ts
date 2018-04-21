import { Component, OnInit } from '@angular/core';
import {CommonService} from '../service/common.service';
import {openFullscreen} from "../utils/common.utils";

@Component({
  selector: 'app-telbook',
  templateUrl: './telbook.component.html',
  styleUrls: ['./telbook.component.css']
})
export class TelbookComponent implements OnInit {

  constructor(private commonService:CommonService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
        this.commonService.fullScreen.subscribe(
          res => {
        if(res == "1"){
          openFullscreen(document.body);
            // jQuery("#middlerow").css("height", "47%");
            // jQuery(".adv-table").css("height", "350px"); 
            // jQuery("#tablesec").css("height", "45%");        
            
          }else{
            // jQuery("#middlerow").css("height", "53%"); 
            // jQuery(".adv-table").css("height", "240px");
            // jQuery("#tablesec").css("height", "36%");       
          }}
        );
      }
    

}
