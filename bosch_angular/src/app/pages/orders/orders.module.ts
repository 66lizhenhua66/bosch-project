import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';

import { OrdersComponent } from './orders.component';
import { OrdersService } from './orders.service';

import { ToasterModule } from 'angular2-toaster';


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ThemeModule,
        ToasterModule,

    ],
    declarations: [
        OrdersComponent,

    ],
    providers: [
        OrdersService,
    ]
})
export class OrdersModule { }
