import { Component, OnInit } from '@angular/core';
import { CommonService} from '../service/common.service';

@Component({
  selector: 'app-home-right',
  templateUrl: './home-right.component.html',
  styleUrls: ['./home-right.component.css']
})
export class HomeRightComponent implements OnInit {

  constructor(private commonService:CommonService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
            this.commonService.toggleButton.subscribe(
              res => {    
            if(res == "open"){
              jQuery(".main-content").css("width","86%");
                // jQuery("#middlerow").css("height", "47%");
                // jQuery(".adv-table").css("height", "350px");
              }else{
                jQuery(".main-content").css("width","97%");
                // jQuery("#middlerow").css("height", "53%"); 
                // jQuery(".adv-table").css("height", "250px");     
              }}
            );
          }
}
