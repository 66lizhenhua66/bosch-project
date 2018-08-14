import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';

import { ToasterModule } from 'angular2-toaster';

import { CraftsComponent } from './crafts.component';
import { EachcraftComponent } from './eachcraft/eachcraft.component';


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ThemeModule,
        ToasterModule,
    ],
    declarations: [
        CraftsComponent,
        EachcraftComponent,

    ],
})
export class CraftsModule { }
