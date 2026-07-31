import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestrictionsService {

  constructor(private http: HttpClient) { }

  getRestrictions(company_id) {
    return this.http.get('company/'+company_id+'/restriction/');
  }

  getBlockedPlaques(company_id) {
    return this.http.get('vehicle/company/'+company_id+'/blocked_plaques');
  }
}
