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

declare global {
  // interface Document {
  //     msExitFullscreen: any;
  //     mozCancelFullScreen: any;
  //     requestFullscreen:any;
  //     webkitRequestFullscreen:any;
  //     webkitRequestFullScreen:any;
  //     mozRequestFullScreen:any;
  //     msRequestFullscreen:any;
      
  // }
  interface JQuery  {
       slider: any;
      // mozRequestFullScreen: any;
  }
}
declare const slider;

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
    // jQuery("#slider2").slider({
    //   width: 438, // width
    //   height: 40, // height
    //   sliderBg: "rgb(134, 134, 131)", // 滑块背景颜色
    //   color: "#fff", // 文字颜色
    //   fontSize: 14, // 文字大小
    //   bgColor: "#33CC00", // 背景颜色
    //   textMsg: "按住滑块，拖拽验证", // 提示文字
    //   successMsg: "验证通过了哦", // 验证成功提示文字
    //   successColor: "red", // 滑块验证成功提示文字颜色
    //   time: 400, // 返回时间
    //   callback: function(result) { // 回调函数，true(成功),false(失败)
    //     jQuery("#result2").text(result);
    //   }
    // });
    
  }

  

  onSubmit() {

    if (this.formModel.hasError('required', ['email']) || this.formModel.get('email').untouched) {
      this.commonService.showTip(jQuery('#tip1'), 'danger');
    } else if (this.formModel.hasError('asyncValidator', ['email'])) {
      this.commonService.showTip(jQuery('#tip3'), 'danger');
    } else if (this.formModel.get('email').invalid) {
      this.commonService.showTip(jQuery('#tip2'), 'danger');
    } else if (this.formModel.hasError('required', ['password']) || this.formModel.get('password').untouched) {
      this.commonService.showTip(jQuery('#tip4'), 'danger');
    } else if (this.formModel.hasError('minlength', ['password']) || this.formModel.hasError('maxlength', ['password'])) {
      this.commonService.showTip(jQuery('#tip5'), 'danger');
    } else {
　　　　this.router.navigate(['home']);　　
    }

  }

 
}

// export class User {
//   constructor(
//       private id: string,            // 用户ID
//       public email: string,         // 邮箱
//       password: string,      // 密码
//       type: string,          // 用户类型：01：猎头公司 02：客户公司
//       role: string           // 用户权限: 0101:管理  0102:市场  0103:营业  （←猎头公司）（客户公司→） 0201：总部   0202：分部
//   ) { }
// }
// export class LoginError {
//   errorId: string;
//   errorMsgZh: String;
//   errorMsgJp: string;
//   errorMsgEn: string
// }

// export class Login {
// constructor(public email: string, public password: string) {
// }
// }

// 异步调用用来验证邮箱的合法性
// emailAsyncValidator(control:FormControl):any{
//   // alert("1");
//   // Rx.Observable.sub()
//   this.mockServicejQuery.getUsers().subscribe(
//      res => {this.users = res});
//     let tempUsers = this.users.filter(res => res.email===control.get('email').value);
//     if(tempUsers!=null){
//       this.loginUser = tempUsers[0];
//       // alert("2sda");
//   }
//   return this.loginUser?null:{emailAsyncValidator:true}
// }

// this.formModel.controls['email'].setValidators([Validators.required, Validators.email]);

// this.formModel.controls['email'].setAsyncValidators(this.emailAsyncValidator);
// this.formModel.get('password').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(12)]);
// this.formModel.updateValueAndValidity();
// this.formModel.controls['email'].updateValueAndValidity();
// this.formModel.get('email').updateValueAndValidity({onlySelf:true});

