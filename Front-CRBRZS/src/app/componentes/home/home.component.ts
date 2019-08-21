import { Component, OnInit,ViewChild , DoCheck} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {PrestamoService} from '../../servicies/prestamo.service';
import {Prestamo} from '../../model/prestamo';
import {PersonaService} from '../../servicies/persona.service';
import {MatPaginator} from '@angular/material';
import {MatTableDataSource} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material';
declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[PrestamoService]
})
export class HomeComponent implements OnInit, DoCheck {

  public identity;
  public token;
displayedColumns: string[] = ['select','preNumero','Nom_Persona'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource:any;
  selection = new SelectionModel<Prestamo>(true, []);
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    
    return numSelected === numRows;
  }
  masterToggle() {
   
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?: Prestamo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.preNumero + 1}`;
  }
  public prestamos:any;
  public prestamosF:any;
  constructor(private _route:ActivatedRoute,
    private _router:Router,private _personaService:PersonaService,private _prestamoService:PrestamoService) { 
    this.identity = this._personaService.obtIdentity();
    console.log(this.identity)
    this.token = this._personaService.obtToken();
  }

  ngOnInit() {
    this.identity = this._personaService.obtIdentity();
    console.log(this.identity)
    this.token = this._personaService.obtToken();
    this.obtenerPrestamos();
    if(this.identity == null){
      this._router.navigate(['login']);
    }
  }
  ngDoCheck(){
    this.identity = this._personaService.obtIdentity();
    this.token = this._personaService.obtToken();
    
    }
  obtenerPrestamos(){
    this._prestamoService.obtPrestamos().subscribe(
      response=>{
        var prestamosFinal = [];
        this.prestamos = response.consulta;
        console.log(this.prestamos);
        this.dataSource = new MatTableDataSource<Prestamo>(this.prestamos);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
           
        /*this.prestamos.forEach(pres => {
          prestamosFinal.push(pres)
        });
       console.log(prestamosFinal)*/
      },
      error=>{
        console.log(<any>error)
      }
    )

  }

  enviar(){
    var tot = this.isAllSelected();
    console.log(this.selection.selected)
    
  }
  
}
