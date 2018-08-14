import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';

import { StationsComponent } from './stations.component';
import { StationsRoutingModule } from './stations-routing.module';
import { AutoComponent } from './auto/auto.component';
import { HandComponent } from './hand/hand.component';

import { StationsService } from './stations.service';

import { ProgramsService } from '../pages/programs.service';

import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    ThemeModule,

    StationsRoutingModule,
    PdfViewerModule,  // pdf插件
  ],
  declarations: [
    StationsComponent,
    AutoComponent,
    HandComponent,
  ],
  providers: [
    ProgramsService,
    StationsService,
  ]
})
export class StationsModule {
}
