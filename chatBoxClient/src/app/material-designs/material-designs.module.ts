import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule, MatCardModule, MatSidenavModule} from '@angular/material';

@NgModule({
  imports: [ MatTabsModule, MatCardModule, MatSidenavModule],
  exports: [ MatTabsModule, MatCardModule, MatSidenavModule],
})
export class MaterialDesignsModule { }
