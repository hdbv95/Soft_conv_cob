import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';
@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  public url:string;
  constructor(public _http:HttpClient) { 
    this.url = GLOBAL.url;
  }


  obtPrestamos():Observable<any>{
    console.log("entro")
    let headers = new HttpHeaders().set('Content-Type','application/json');
  
    return this._http.get(this.url+'obtener-prestamos', {headers:headers});
  }
}
