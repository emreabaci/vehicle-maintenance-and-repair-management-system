import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  registerUser(user: any){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache'
    });   

    return this.http.post('http://localhost:3000/users/register', user, { headers: httpHeaders }).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    )
  }

  login(user: any){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache'
    });   

    return this.http.post('http://localhost:3000/users/authenticate', user, { headers: httpHeaders }).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    )
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();

    this.router.navigate(['/home']);
  }

  storeUserData(token: string, user: any){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    const user = localStorage.getItem('user');
    this.authToken = token;

    if(user){
      this.user = JSON.parse(user);
    }
  }

  get loggedIn(){
      let authToken = localStorage.getItem('id_token');
      return authToken !== null ? true : false;
  }

  get currentUser(){
    return this.user;
  }

  private extractData(res: any){
    return res;
  }

  private handleErrorObservable(error: any) {
    console.error(error.message || error);
    return throwError(error);
}
}
