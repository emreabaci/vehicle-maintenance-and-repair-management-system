import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, pipe, throwError } from 'rxjs';
import { AuthService } from 'src/app/account/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getStatistics(){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': this.authService.authToken
    });   

    return this.http.get(`http://localhost:3000/statistics`, { headers: httpHeaders }).pipe(
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
