import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';

import { ToasterModule } from 'angular2-toaster';

import { SkillsComponent } from './skills.component';


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ThemeModule,
        ToasterModule,

    ],
    declarations: [
        SkillsComponent,
    ],
    providers: [
    ]
})
export class SkillsModule { }
