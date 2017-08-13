import { CanActivate} from '@angular/router';
/**
 * Created by Bowen on 2017-08-12
 */
export class LoginGuard implements CanActivate {

  // Alt+shift+P
  canActivate() {
    return true;
  }
}
