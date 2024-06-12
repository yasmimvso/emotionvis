import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { RoutingModule } from './app.routas.module';

import { BodyvisComponent } from './vis/bodyvis/bodyvis.component';
import { AlphavisComponent } from './vis/alphavis/alphavis.component';
import {AlphavisIdComponent} from './vis/alphavis-id/alphavis-id.component';
import { VisDataComponent } from './vis/vis-data/vis-data.component';

import { TamplateComponent } from './component/tamplate/tamplate.component';
import { FooterComponent } from './component/footer/footer.component';
import { NavComponent } from './component/nav/nav.component'
import { MidiaComponent} from './component/midia/midia.component';

import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list';
import { MatCardModule} from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';

// // excluir quando terminar a substituição de
// import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';


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
    MidiaComponent
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
    // CanvasJSAngularChartsModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
