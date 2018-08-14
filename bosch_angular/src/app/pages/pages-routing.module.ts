import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { CraftsComponent } from './crafts/crafts.component';
import { OrdersComponent } from './orders/orders.component';
import { ManagerComponent } from './manager/manager.component';
import { SkillsComponent } from './skills/skills.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
  {
    path: 'crafts',
    component: CraftsComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'manager',
    component: ManagerComponent,
  },
  {
    path: 'skills',
    component: SkillsComponent,
  },
  // {
  //   path: 'manager',
  //   loadChildren: './tables/tables.module#TablesModule',
  // }, 
    
  {
    path: 'ui-features',
    loadChildren: './ui-features/ui-features.module#UiFeaturesModule',
  }, {
    path: 'components',
    loadChildren: './components/components.module#ComponentsModule',
  }, {
    path: 'maps',
    loadChildren: './maps/maps.module#MapsModule',
  }, {
    path: 'charts',
    loadChildren: './charts/charts.module#ChartsModule',
  }, {
    path: 'editors',
    loadChildren: './editors/editors.module#EditorsModule',
  }, {
    path: 'forms',
    loadChildren: './forms/forms.module#FormsModule',
  }, 
  {
    path: 'miscellaneous',
    loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
  }, 
  {
    path: '',
    redirectTo: 'crafts',
    pathMatch: 'full',
  }, {
    path: '**',
    component: NotFoundComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
