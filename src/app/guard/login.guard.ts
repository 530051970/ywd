import { Injectable} from '@angular/core';
import { CanActivate,Router} from '@angular/router';
/**
 * Created by Bowen on 2017-08-12
 */
@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private router:Router){}

  canActivate() {
    if(sessionStorage.getItem('userId')=='1111')
      return true;
    // 未登录的时候跳转到登录页面
    this.router.navigate(["login"]);
    return false;
  }
}
