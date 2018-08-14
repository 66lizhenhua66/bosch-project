import { NgModule } from '@angular/core';
import { ProgramLoginComponent } from './program-login.component';
import { ThemeModule } from '../../@theme/theme.module';


@NgModule({
  declarations: [ ProgramLoginComponent ],
  imports: [
    ThemeModule,

  ],
  bootstrap: [],
  providers: [
  ],
})
export class ProgramLoginModule {
}
