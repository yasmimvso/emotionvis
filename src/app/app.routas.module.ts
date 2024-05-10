

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {  BodyvisComponent } from './vis/bodyvis/bodyvis.component'
import { AlphavisComponent } from './vis/alphavis/alphavis.component';
import {AlphavisIdComponent} from './vis/alphavis-id/alphavis-id.component'
import { VisDataComponent } from './vis/vis-data/vis-data.component'

const routes: Routes = [
  { path: "", component:  BodyvisComponent },
  { path: "alphavis", component:  AlphavisComponent},
  {path: "alphavisId", component: AlphavisIdComponent},
  {path: "visData", component: VisDataComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }

