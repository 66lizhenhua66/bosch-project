import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';


import { ProgramsService } from './programs.service';

import { CraftsModule } from './crafts/crafts.module';
import { OrdersModule } from './orders/orders.module';
import { ManagerModule } from './manager/manager.module';

import { SkillsModule } from './skills/skills.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    MiscellaneousModule,

    CraftsModule,
    OrdersModule,
    ManagerModule,
    SkillsModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
  providers: [
    ProgramsService,

  ]
})
export class PagesModule {
}
