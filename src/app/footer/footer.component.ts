import {Component, OnInit} from '@angular/core';
import {CommonService} from '../service/common.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
  }

  onChangeLang(lang: string) {
    this.commonService.onChangeLang(lang);
  }

}
