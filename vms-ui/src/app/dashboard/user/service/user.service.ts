import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { AuthService } from 'src/app/account/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllUsers(pageNo: number, search?:string, role?:string){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': this.authService.authToken
    });   

    let apiCall = '';
    if(search){
      apiCall = `http://localhost:3000/users?pageNo=${pageNo}&size=10&search=${search}${(role == undefined) ? '' : '&role=' + role}`;
    } else {
      apiCall = `http://localhost:3000/users?pageNo=${pageNo}&size=10${(role == undefined) ? '' : '&role=' + role}`;
    }

    return this.http.get(apiCall, { headers: httpHeaders }).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    )
  }

  updateUser(id: string, role: string, name: string, username: string, email: string, telephone: string, password?:string){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': this.authService.authToken
    });   

    return this.http.put('http://localhost:3000/users', {id, role, name, username, email, telephone, password}, { headers: httpHeaders }).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    )
  }

  deleteUser(id:string){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': this.authService.authToken
    });
    
    return this.http.delete(`http://localhost:3000/users/${id}`, { headers: httpHeaders }).pipe(
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
