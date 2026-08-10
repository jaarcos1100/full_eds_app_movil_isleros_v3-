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

  /**
   * Restricción que debe aplicar la venta: la de la placa si tiene una propia
   * (sobrescribe), si no la de la empresa.
   */
  getEffectiveRestriction(company_id, vehicle_id) {
    if (vehicle_id) {
      return this.http.get('restriction/effective/company/' + company_id + '/vehicle/' + vehicle_id);
    }
    return this.http.get('restriction/effective/company/' + company_id);
  }

  getBlockedPlaques(company_id) {
    return this.http.get('vehicle/company/'+company_id+'/blocked_plaques');
  }
}
