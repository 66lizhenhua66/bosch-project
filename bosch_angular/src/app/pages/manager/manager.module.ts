import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';

import { ManagerComponent } from './manager.component';
import { SmartTableService } from '../../@core/data/smart-table.service';

import { ToasterModule } from 'angular2-toaster';


@NgModule({
    imports: [
        ThemeModule,
        Ng2SmartTableModule,
        ToasterModule,
    ],
    declarations: [
        ManagerComponent,
    ],
    providers: [
        SmartTableService,
    ],
})
export class ManagerModule { }
