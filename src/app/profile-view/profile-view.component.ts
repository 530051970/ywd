import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  follow:boolean=true;

  constructor() { }

  ngOnInit() {
  }

  onFollow(){
    this.follow=false;
  }

  onCancelFollow(){
    this.follow=true;
  }

}
