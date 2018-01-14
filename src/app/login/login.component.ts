import {Component, OnInit} from '@angular/core';
import {CommonService} from '../service/common.service';
import {
  FormBuilder, FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl,
  ValidationErrors
} from "@angular/forms";
import {MockService} from '../service/mock.service';
import {User} from "../model/user.model";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";

// declare const slider;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formModel: FormGroup;
  users: User[];
  validationTimeout:any;
  notRegister: boolean;
  // 使用FormBuilder比传统的FormGroup代码更简洁
  constructor(private commonService: CommonService, private fb: FormBuilder, private mockServicejQuery: MockService,private router: Router) {
    this.formModel = this.fb.group({
      email: ['', [Validators.required, Validators.email],this.asyncValidator()],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]]
    });
  }

  asyncValidator(): AsyncValidatorFn {
    
    return (control: AbstractControl): Promise<ValidationErrors> => {
      clearTimeout(this.validationTimeout);
      return new Promise((resolve, reject) => {
        this.validationTimeout = setTimeout(() => {
          this.mockServicejQuery.getUsers(control.value).bufferWhen(() => {
            return Observable.interval(500);
          }).subscribe((res) => {
            console.log(res);
            if ((Number(res) === 0)) {
              this.notRegister = true;
              resolve({asyncValidator: true});
            } else {
              this.notRegister = false;
              resolve(null);
            }
          });
        }, 400);
      });
    };
  }

  ngOnInit() {
    this.formModel = this.fb.group({
      email: ['', [Validators.required, Validators.email],this.asyncValidator()],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]]
    });
       
  }

  

  onSubmit() {

//     if (this.formModel.hasError('required', ['email']) || this.formModel.get('email').untouched) {
//       this.commonService.showTip(jQuery('#tip1'), 'danger');
//     } else if (this.formModel.hasError('asyncValidator', ['email'])) {
//       this.commonService.showTip(jQuery('#tip3'), 'danger');
//     } else if (this.formModel.get('email').invalid) {
//       this.commonService.showTip(jQuery('#tip2'), 'danger');
//     } else if (this.formModel.hasError('required', ['password']) || this.formModel.get('password').untouched) {
//       this.commonService.showTip(jQuery('#tip4'), 'danger');
//     } else if (this.formModel.hasError('minlength', ['password']) || this.formModel.hasError('maxlength', ['password'])) {
//       this.commonService.showTip(jQuery('#tip5'), 'danger');
//     } else {
// 　　　　this.router.navigate(['home']);　　
//     }
sessionStorage.setItem("userId", "1111");
this.router.navigate(['home']);　
  }

 
}

