import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './componentes/home/home.component';
import {HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import {} from '@angular/material';

import {
  MatToolbarModule,  
  MatTabsModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatOptionModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatCheckboxModule,
  
  
} from '@angular/material';
import { LoginComponent } from './componentes/login/login.component';
import { NavComponent } from './componentes/personalizacion/nav/nav.component';
import { NavuserComponent } from './componentes/personalizacion/navuser/navuser.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatComponent } from './componentes/chat/chat.component';
import { ParticlesModule } from 'angular-particle';
import { AsesorComponent } from './componentes/asesor/asesor.component';
import { PruebaComponent } from './componentes/prueba/prueba.component';
const config: SocketIoConfig = { url: 'http://localhost:6001', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavComponent,
    NavuserComponent,
    ChatComponent,
    AsesorComponent,
    PruebaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,  
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule ,
    MatCheckboxModule,
    ParticlesModule,
   SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
