import { NgModule } from '@angular/core';

import { ProgramLoginComponent } from './program-login/program-login.component';
import { StationLoginComponent } from './station-login/station-login.component';
import { ThemeModule } from '../@theme/theme.module';

@NgModule({
  imports: [
      ThemeModule,

  ],
  declarations: [
      ProgramLoginComponent,
      StationLoginComponent,
  ],
  providers: [
   
  ]
})
export class LoginModule {
}
