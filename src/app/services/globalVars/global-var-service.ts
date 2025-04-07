import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarService {

  constructor(private http: HttpClient) { }


  getGlobalVar() {
    return this.http.get('global/var/');
  }
}
