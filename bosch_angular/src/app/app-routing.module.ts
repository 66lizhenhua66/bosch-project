import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';

import { StationRouteGuard } from './guards/StationGuard';
import { ProgramRouteGuard } from './guards/ProgramGuard';

import { ProgramLoginComponent } from './login/program-login/program-login.component';
import { StationLoginComponent } from './login/station-login/station-login.component';

import { LogoutComponent } from './logout/logout.component';


const routes: Routes = [
  { 
    path: 'pages', 
    loadChildren: 'app/pages/pages.module#PagesModule',
    canActivate: [ProgramRouteGuard, ],
  },

  {
    path: 'login/program',
    component: ProgramLoginComponent,
  },
  {
    path: 'login/station/:id',
    component: StationLoginComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'logout/:id',
    component: LogoutComponent,
  },

  // {
  //   path: 'login',
  //   loadChildren: 'app/login/login.module#LoginModule',
  // },
  { 
    path: 'stations', 
    loadChildren: 'app/stations/stations.module#StationsModule',
    canActivate: [StationRouteGuard],
  },
  { path: '', redirectTo: 'login/program', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
