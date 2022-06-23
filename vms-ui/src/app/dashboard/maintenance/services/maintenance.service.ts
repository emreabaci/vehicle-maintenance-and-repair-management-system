import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { AuthService } from 'src/app/account/services/auth.service';
import { Maintenance } from '../../models/Maintenance';
import { VehicleAssignType } from '../../models/vehicle-assign-type';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  createMaintenance(userID: number, maintenance: Maintenance){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': this.authService.authToken
    });   

    return this.http.post('http://localhost:3000/maintenances', {userID, maintenance}, { headers: httpHeaders }).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    )
  }

  updateMaintenance(updatedMaintenance: Maintenance){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': this.authService.authToken
    });   

    return this.http.put('http://localhost:3000/maintenances', {updatedMaintenance}, { headers: httpHeaders }).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    )
  }

  deleteMaintenance(id: string){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': this.authService.authToken
    });

    console.warn("deleteMaintenance: ", id);
    
    return this.http.delete(`http://localhost:3000/maintenances/${id}`, { headers: httpHeaders }).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    )
  }

  getAllMaintenances(pageNo: number, searchByPlateNumber?:string, type?:number){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': this.authService.authToken
    });   

    let apiCall = '';
    if(searchByPlateNumber){
      apiCall = `http://localhost:3000/maintenances?pageNo=${pageNo}&size=10&plateNumber=${searchByPlateNumber}${(type == undefined) ? '' : '&type=' + type}`;
    } else {
      apiCall = `http://localhost:3000/maintenances?pageNo=${pageNo}&size=10${(type == undefined) ? '' : '&type=' + type}`;
    }

    return this.http.get(apiCall, { headers: httpHeaders }).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    )
  }

  private extractData(res: any){
    return res;
  }

  private handleErrorObservable(error: any) {
    console.error(error.message || error);
    return throwError(error);
  }
}
