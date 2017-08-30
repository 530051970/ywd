import { Injectable,Inject } from '@angular/core';
import  {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../model/user.model';


@Injectable()
export class MockService {


  constructor(private http:Http,@Inject('BASE_CONFIG')private config) {}
  //获取所有用户信息（users表）
  getUsers(obj):Observable<User[]>{
    // alert("22222"); 
    const uri = `${this.config.json_server_uri}/users?email=`+obj;
    return this.http.get(uri).map(res => res.json() as User[]);
  }
  //获取菜单
  

}
