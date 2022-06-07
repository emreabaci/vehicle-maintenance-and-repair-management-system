import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient) {}

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

  private extractData(res: any){
    return res;
  }

  private handleErrorObservable(error: any) {
    console.error(error.message || error);
    return throwError(error);
}
}
