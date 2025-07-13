import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  constructor(private http: HttpClient) { }

  /*
  updateCustomerInCloud(company_id) {
    return this.http.put<any>('company/'+company_id+'/updateInCloud/', {}, { observe: 'response' });
  }*/
}
