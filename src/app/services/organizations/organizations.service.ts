import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Organization } from 'src/app/models/organization/organization';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {

  constructor(private http: HttpClient) { }

  createOrganization(org:any) {
    return this.http.post<any>("organization/create", org, { observe: 'response' });
  }

  updateOrganization(id, org:any) {
    return this.http.put<any>("organization/update/"+id, org, { observe: 'response' });
  }
  getOrganizationAliasAdmin() {
    return this.http.get<any>("organization/admin", { observe: 'response' });
  }

  getValidateInfo() {
    return this.http.get<any>("organization/validate/data", { observe: 'response' });
  }

  getOrganizations(page,quantity):Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('page', page).set('limit',quantity)
    return this.http.get<any>('organization/list',{observe: 'response',headers});
  }
}
