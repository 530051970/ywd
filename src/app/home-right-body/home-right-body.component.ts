import { Component, OnInit } from '@angular/core';
import {CommonService} from '../service/common.service';
// import * as Quill from 'quill';
declare const jQuery:any;
// declare const moment:any;
// declare const calendars:any;
// declare const clndr:any;


@Component({
  selector: 'app-home-right-body',
  templateUrl: './home-right-body.component.html',
  styleUrls: ['./home-right-body.component.css']
})
export class HomeRightBodyComponent implements OnInit {

    // const openSpeacker:any
    private data7_1 = [
        [1354586000000, 253],
        [1354587000000, 465],
        [1354588000000, 498],
        [1354589000000, 383],
        [1354590000000, 280],
        [1354591000000, 108],
        [1354592000000, 120],
        [1354593000000, 474],
        [1354594000000, 623],
        [1354595000000, 479],
        [1354596000000, 788],
        [1354597000000, 836]
    ];
    private data7_2 = [
        [1354586000000, 253],
        [1354587000000, 465],
        [1354588000000, 498],
        [1354589000000, 383],
        [1354590000000, 280],
        [1354591000000, 108],
        [1354592000000, 120],
        [1354593000000, 474],
        [1354594000000, 623],
        [1354595000000, 479],
        [1354596000000, 788],
        [1354597000000, 836]
    ];
    private fullscreen:string;

  constructor(private commonService:CommonService) { }

  ngOnInit() { 
    // 业绩走势
    jQuery.plot(jQuery("#visitors-chart #visitors-container"), [{
        data: this.data7_1,
        label: "本月",
        lines: {
            fill: true
        }
    }, {
        data: this.data7_2,
        label: "上月",

        points: {
            show: true
        },
        lines: {
            show: true
        },
        yaxis: 2
    }
    ],
        {
            series: {
                lines: {
                    show: true,
                    fill: false
                },
                points: {
                    show: true,
                    lineWidth: 2,
                    fill: true,
                    fillColor: "#ffffff",
                    symbol: "circle",
                    radius: 5
                },
                shadowSize: 0
            },
            grid: {
                hoverable: true,
                clickable: true,
                tickColor: "#f9f9f9",
                borderWidth: 1,
                borderColor: "#eeeeee"
            },
            colors: ["#65CEA7", "#424F63"],
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            },
            xaxis: {
                mode: "time"


            },
            yaxes: [{
                /* First y axis */
            }, {
                /* Second y axis */
                position: "right" /* left or right */
            }]
        }
    );
    // 收入构成饼状图
    var data = [{
        label: "基本工资",
        data: 4000
    }, {
        label: "绩效工资",
        data: 8500
    }, {
        label: "其他",
        data: 2080
    }];
    var options = {
        series: {
            pie: {
                show: true,
                innerRadius: 0.5,
                // show: true
            }
        },
        legend: {
            show: true
        },
        grid: {
            hoverable: true,
            clickable: true
        },
        colors: ["#869cb3", "#6dc5a3", "#778a9f"],
        tooltip: true,
        tooltipOpts: {
            defaultTheme: false
        }
    };
    jQuery.plot(jQuery("#pie-chart-donut #pie-donutContainer"), data, options);

    if(1<0){
    setInterval(function(){

        showAndSpeekMessage(function(obj){
            setTimeout(function(){jQuery('#'+obj).remove();},5000)
            
        });
        
    },8000)}

    function showAndSpeekMessage(removeTmpDiv){
        const context="崔胡斌已经入职阿里巴巴集团！";
        console.log(context);
        // 生成一个div
        var mydate = new Date();;
        var tmpId=mydate.getMilliseconds();
        // var tmpId=123;
        // var tmpDiv=jQuery('<div></div>');        //创建一个父div
        // tmpDiv.attr('id',tmpId);        //给父div设置id
        // tmpDiv.attr('display',"hidden");
        // tmpDiv.text(context);    
        // tmpDiv.appendto("body");
        jQuery(document.body).append('<div id='+tmpId+' style="display:none">'+context+'</div>');
       console.log(tmpId);
        // 文字提醒
        jQuery.gritter.add({  
            title: '易招提醒您:',  
            text: context,  
            image: '../../assets/img/photos/user1.png',  
            sticky: false,  
            time: 3000,  
            speed:3000,  
            position: 'bottom-right',  
            class_name: 'gritter-success'//gritter-center   
        }); 
        jQuery('#'+tmpId).speech({
            "speech": false,
            "speed": 6,
        });        
        removeTmpDiv&&removeTmpDiv(tmpId);
    }


    
    }

    ngAfterViewInit() {

        this.commonService.fullScreen.subscribe(
          res => {this.fullscreen = res;

        if(this.fullscreen == "1"){
            jQuery("#middlerow").css("height", "44%");
            jQuery(".adv-table").css("height", "350px"); 
            jQuery("#tablesec").css("height", "45%");   
            jQuery(".main-content").css("height", "100%");          
            
          }else{
            jQuery("#middlerow").css("height", "48%"); 
            jQuery(".adv-table").css("height", "240px");
            jQuery("#tablesec").css("height", "36%");       
          }}
        );

      
      }



  onClickHeart(obj1,obj2,obj3,obj4){
    jQuery(obj1).show();
    jQuery(obj2).add(obj3).add(obj4).hide();
    if(!jQuery(obj1).hasClass("active")){
      jQuery(obj1).addClass("active");      
    }
    jQuery(obj2).add(obj3).add(obj4).removeClass("active");

  }

  onClickRetro(obj1,obj2,obj3,obj4){
    jQuery(obj2).show();   
    jQuery(obj1).add(obj3).add(obj4).hide();
    if(!jQuery(obj2).hasClass("active")){
      jQuery(obj2).addClass("active");      
    }
    jQuery(obj1).add(obj3).add(obj4).removeClass("active");

  }

  onClickTodo(obj1,obj2,obj3,obj4){
    jQuery(obj3).show();
    jQuery(obj1).add(obj2).add(obj4).hide();
    if(!jQuery(obj3).hasClass("active")){
      jQuery(obj3).addClass("active");      
    }
    jQuery(obj1).add(obj2).add(obj4).removeClass("active");
  }

  onClickSaying(obj1,obj2,obj3,obj4){
    jQuery(obj4).show();
    jQuery(obj1).add(obj2).add(obj3).hide();
    if(!jQuery(obj4).hasClass("active")){
      jQuery(obj4).addClass("active");      
    }
    jQuery(obj1).add(obj2).add(obj3).removeClass("active");

  }




}
