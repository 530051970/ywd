import { Component, OnInit } from '@angular/core';
declare const jQuery:any;
declare const moment:any;
declare const calendars:any;
declare const clndr:any;


@Component({
  selector: 'app-home-right-body',
  templateUrl: './home-right-body.component.html',
  styleUrls: ['./home-right-body.component.css']
})
export class HomeRightBodyComponent implements OnInit {
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

  constructor() { }

  ngOnInit() { 
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
    //   //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //     //Add 'implements AfterViewInit' to the class.
    //     var thisMonth = moment().format('YYYY-MM');   
    //     var eventArray = [
    //         { startDate: thisMonth + '-10', endDate: thisMonth + '-14', title: 'Multi-Day Event' },
    //         { startDate: thisMonth + '-21', endDate: thisMonth + '-23', title: 'Another Multi-Day Event' }
    //     ];
   
    //     calendars.clndr1 = jQuery('.cal1').clndr({
    //         events: eventArray,
    //         // constraints: {
    //         //   startDate: '2013-11-01',
    //         //   endDate: '2013-11-15'
    //         // },
    //         clickEvents: {
    //             click: function(target) {
    //                 console.log(target);
    //                 // if you turn the `constraints` option on, try this out:
    //                 // if(jQuery(target.element).hasClass('inactive')) {
    //                 //   console.log('not a valid datepicker date.');
    //                 // } else {
    //                 //   console.log('VALID datepicker date.');
    //                 // }
    //             },
    //             nextMonth: function() {
    //                 console.log('next month.');
    //             },
    //             previousMonth: function() {
    //                 console.log('previous month.');
    //             },
    //             onMonthChange: function() {
    //                 console.log('month changed.');
    //             },
    //             nextYear: function() {
    //                 console.log('next year.');
    //             },
    //             previousYear: function() {
    //                 console.log('previous year.');
    //             },
    //             onYearChange: function() {
    //                 console.log('year changed.');
    //             }
    //         },
    //         multiDayEvents: {
    //             startDate: 'startDate',
    //             endDate: 'endDate'
    //         },
    //         showAdjacentMonths: true,
    //         adjacentDaysChangeMonth: false
    //     });
    
    //     calendars.clndr2 = jQuery('.cal2').clndr({
    //         template: jQuery('#template-calendar').html(),
    //         events: eventArray,
    //         startWithMonth: moment().add('month', 1),
    //         clickEvents: {
    //             click: function(target) {
    //                 console.log(target);
    //             }
    //         },
    //         forceSixRows: true
    //     });
    
    //     // bind both clndrs to the left and right arrow keys
    //     jQuery(document).keydown( function(e) {
    //         if(e.keyCode == 37) {
    //             // left arrow
    //             calendars.clndr1.back();
    //             calendars.clndr2.back();
    //         }
    //         if(e.keyCode == 39) {
    //             // right arrow
    //             calendars.clndr1.forward();
    //             calendars.clndr2.forward();
    //         }
    //     });
    }

  onClickHeart(obj1,obj2,obj3){
    jQuery(obj1).show();
    jQuery(obj2).add(obj3).hide();
    if(!jQuery(obj1).hasClass("active")){
      jQuery(obj1).addClass("active");      
    }
    jQuery(obj2).add(obj3).removeClass("active");

    // alert("PPP");
  }

  onClickRetro(obj1,obj2,obj3){
    jQuery(obj2).show();   
    jQuery(obj1).add(obj3).hide();
    if(!jQuery(obj2).hasClass("active")){
      jQuery(obj2).addClass("active");      
    }
    jQuery(obj1).add(obj3).removeClass("active");

  }

  onClickTodo(obj1,obj2,obj3){
    jQuery(obj3).show();
    jQuery(obj1).add(obj2).hide();
    if(!jQuery(obj3).hasClass("active")){
      jQuery(obj3).addClass("active");      
    }
    jQuery(obj1).add(obj2).removeClass("active");

  }

}
