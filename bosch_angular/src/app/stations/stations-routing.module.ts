import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StationsComponent } from './stations.component';
import { AutoComponent } from './auto/auto.component';
import { HandComponent } from './hand/hand.component';


const routes: Routes = [
  {
    path: ':station',
    component: StationsComponent,
  },
  {
    path: 'auto/:id',
    component: AutoComponent,
  },
  {
    path: 'hand/:id',
    component: HandComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StationsRoutingModule {
}
