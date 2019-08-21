import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './componentes/home/home.component';
import { LoginComponent} from './componentes/login/login.component';
import { ChatComponent} from './componentes/chat/chat.component';
import { AsesorComponent} from './componentes/asesor/asesor.component';
import { PruebaComponent} from './componentes/prueba/prueba.component';
const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'login',component:LoginComponent},
  {path:'cobranzas',component:HomeComponent},
  {path:'asesor',component:AsesorComponent},
  {path:'asesor/:sala',component:AsesorComponent},
  {path:'chat',component:ChatComponent},
  {path:'pruebam',component:PruebaComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
