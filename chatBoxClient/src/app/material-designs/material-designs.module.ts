import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule, MatCardModule, MatSidenavModule, MatButtonModule} from '@angular/material';

@NgModule({
  imports: [ MatTabsModule, MatCardModule, MatSidenavModule, MatButtonModule],
  exports: [ MatTabsModule, MatCardModule, MatSidenavModule, MatButtonModule],
})
export class MaterialDesignsModule { }
