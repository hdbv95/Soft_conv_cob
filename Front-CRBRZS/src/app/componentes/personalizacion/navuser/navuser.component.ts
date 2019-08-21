import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
@Component({
  selector: 'app-navuser',
  templateUrl: './navuser.component.html',
  styleUrls: ['./navuser.component.css']
})
export class NavuserComponent implements OnInit {

  public identity;

  constructor(private _route:ActivatedRoute,
    private _router:Router) { }

  ngOnInit() {
  }
  cerrarSesion(){
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['login']);
  }

}
