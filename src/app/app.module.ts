import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TamplateComponent } from './component/tamplate/tamplate.component';

import { MatToolbarModule} from '@angular/material/toolbar';
import { FooterComponent } from './component/footer/footer.component';
import { NavComponent } from './component/nav/nav.component'

import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list';

import {MatCardModule} from '@angular/material/card';
import { RoutingModule } from './app.rotas.module';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BodyvisComponent } from './vis/bodyvis/bodyvis.component'

import { AlphavisComponent } from './vis/alphavis/alphavis.component'

import {AlphavisIdComponent} from './vis/alphavis-id/alphavis-id.component'
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { VisDataComponent } from './vis/vis-data/vis-data.component'
import {ChartComponent} from './component/chart/chart.component'


@NgModule({
  declarations: [
    AppComponent,
    TamplateComponent,
    FooterComponent,
    NavComponent,
    BodyvisComponent,
    AlphavisComponent,
    AlphavisIdComponent,
    VisDataComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    RoutingModule,
    FormsModule,
    HttpClientModule,
    CanvasJSAngularChartsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
