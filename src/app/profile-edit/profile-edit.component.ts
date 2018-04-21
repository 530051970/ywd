import { Component, OnInit } from '@angular/core';
import * as Quill from 'quill';
declare const value:any;

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  // 基本资料按钮的更替显示
  infoviewer:boolean=true
  // 联系方式的更替显示
  contactViewer:boolean=true
  // 图像的更替显示
  showUserpic:boolean=true;
  constructor() { }

  ngOnInit() {
   
  }

  ngAfterViewInit() {
    var quill = new Quill('#editor-container', {
      modules: {
        toolbar: [
          ['bold', 'italic'],
          ['link', 'blockquote', 'code-block', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }]
        ]
      },
      placeholder: '内容不少于十个字符...',
      theme: 'snow'
    });
    
    var form = document.querySelector('form');
    form.onsubmit = function() {
      // Populate hidden form on submit
      var about = document.querySelector('input[name=about]');
      // about.value = JSON.stringify(quill.getContents());
      
      console.log("Submitted", $(form).serialize(), $(form).serializeArray());
      
      // No back end to actually submit to!
      alert('Open the console to see the submit data!')
      return false;
    };
  }

  onMouseOver=()=>{
    this.showUserpic = false;
  }

  onMouseOut(){
    this.showUserpic = true;
  }

  onSaveInfo=()=>{
    this.infoviewer = true;
  }

  onUpdateInfo=()=>{
    this.infoviewer = false;
  }

  onSaveContact=()=>{
    this.contactViewer = true;
  }
  onUpdateContact=()=>{
    this.contactViewer = false;
  }

}
