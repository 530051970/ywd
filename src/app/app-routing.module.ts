import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {Code404Component} from './code404/code404.component';
import {ControlPanelComponent} from './control-panel/control-panel.component';
import {TelbookComponent} from './telbook/telbook.component';
import {ProfileViewComponent} from './profile-view/profile-view.component';
import {ProfileEditComponent} from './profile-edit/profile-edit.component';
import {BlogListComponent} from './blog-list/blog-list.component';
import {BlogDetailComponent} from './blog-detail/blog-detail.component';
import {TalentListComponent} from './talent-list/talent-list.component';
import {TalentAddComponent} from './talent-add/talent-add.component';
import {TalentBatchComponent} from './talent-batch/talent-batch.component';


const routes: Routes = [
  // 路由重定向，默认显示登录页面
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent,children:[
    {path: '', component: ControlPanelComponent},
    {path: 'talentlist', component: TalentListComponent},
    {path: 'talentadd', component: TalentAddComponent},
    {path: 'talentbatch', component: TalentBatchComponent},
    {path: 'telbook', component: TelbookComponent},
    {path: 'profile', component: ProfileViewComponent,children:[
      {path: '', component: BlogListComponent},
      {path: 'detail', component: BlogDetailComponent}
    ]},
    {path: 'eprofile', component: ProfileEditComponent}
  ]},
  {path: 'code404', component: Code404Component},
  {path: '**', component: Code404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
