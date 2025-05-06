import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Island} from '../../models/island/Island';
import {Isle} from '../../models/isle/isle';
import {OperatorLogin} from '../../models/operator-login/OperatorLogin';
import {IsleSummary} from '../../models/isle-summary/IsleSummary';
import {RegisterSale} from '../../models/register-sale/RegisterSale';
import {User} from '../../models/user/user';
import {OpenShift, Shift} from '../../models/shift/Shift';
import {Sale} from '../../models/sale/sale';
import {Company} from '../../models/company/company';
import {RecordCopyInvoice} from '../../pages/home/lobby/invoice/invoice.component';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {
  // orgId: string;

  constructor(private http: HttpClient) { }

  /**
   * Isla en la que se abrió tunro
   */
  saveIsland(island: Island) {
    localStorage.setItem('island', JSON.stringify(island));
  }

  readLocalHostIsland(): Isle {
    return JSON.parse(localStorage.getItem('island'));
  }

  /**
   * Servicio para consultar Islas de la Base de Datos
   */
  getIslands() {
    return this.http.get('isle');
  }

  login(loginOperator: OperatorLogin) {
    return this.http.post('auth/login_document', loginOperator);
  }

  getSummary(idIsle: string) {
    return this.http.get(`isle/${idIsle}`);
  }

  /**
   * Guarda Resumen de Combustible de las mangueras
   */
  saveIsleSummary(isleSummary: IsleSummary) {
    localStorage.setItem('isleSummary', JSON.stringify(isleSummary));
  }

  readLocalHostIsleSummary(): IsleSummary {
    return JSON.parse(localStorage.getItem('isleSummary'));
  }

  registerSale(registerSale: RegisterSale) {
    return this.http.post('vehicle/send_authorization', registerSale);
  }

  registerSaleLite(sale: any) {
    return this.http.post('sale/lite/create', sale);
  }

  registerUser(body: any) {
    return this.http.post('isle/create_user', body);
  }

  /**
   * Placa del vehículo con el que se va a realizar la venta
   */
  savePlaque(plate: string) {
    localStorage.setItem('plaque', plate);
  }

  readLocalHostPlaque() {
    return localStorage.getItem('plaque');
  }

  registerSaleIbutton() {
    return this.http.get('register-sale-ibutton');
  }

  verifyTurn(id: number) {
    return this.http.get(`isle/${id}/verify_turn`);
  }

  statusHose(id: number) {
    return this.http.get(`isle/${id}/hoses/status`);
  }

  findShift(id: string) {
    return this.http.get(`shift/find_by_id/${id}`);
  }

  getSaleDetailsSummary(idSale: string) {
    return this.http.get(`sale/details/${idSale}`);
  }

  /**
   * Islero que Abrió turno
   */
  saveOperator(user: User) {
    localStorage.setItem('operator', JSON.stringify(user));
  }

  readLocalHostOperator(): User {
    return JSON.parse(localStorage.getItem('operator'));
  }

  getVolumes(idIsle: number) {
    return this.http.get(`isle/${idIsle}/hoses/volume`);
  }

  getVolumesLite(idIsle: number) {
    return this.http.get(`isle/${idIsle}/hoses/volume/lite`);
  }

  openShift(data: OpenShift) {
    return this.http.post(`shift/open_shift`, data);
  }

  getBasket() {
    return this.http.get(`canastilla`);
  }

  buyInBasket(listProducts) {
    return this.http.post(`sale/create`, listProducts);
  }

  getVehicleDetails(plaque: {plaque: string}) {
    return this.http.post(`vehicle/detail`, plaque);
  }

  getCreditCompany(idCompany: string, saleData: {sale_value: number}) {
    return this.http.post(`company/${idCompany}/verify_credit`, saleData);
  }

  getInfoOrganization() {
    return this.http.get(`organization/admin`);
  }

  toInvoice(saleId, saleData) {
    return this.http.post(`sale/finish/${saleId}`, saleData);
  }

  saveTotalPriceSale(price: number) {
    localStorage.setItem('saleTotalPrice', price.toString());
  }

  readTotalPriceSale(): number {
    return +localStorage.getItem('saleTotalPrice');
  }

  /**
   * _id de la venta que se va a facturar
   * @param saleId
   */
  saveSaleID(saleId: string) {
    localStorage.setItem('saleID', saleId.toString());
  }

  readSaleID() {
    return localStorage.getItem('saleID');
  }

  /**
   * _id de la venta que aparece al oprimir sobre una manguera
   * @param idSale
   */
  saveIdSaleOnInfoSaleOption(idSale: string) {
    localStorage.setItem('idSaleOnInfoOption', idSale);
  }

  readIdSaleOnInfoSaleOption() {
    return localStorage.getItem('idSaleOnInfoOption');
  }

  validatePlaque(plaqueBody: {plaque: string}) {
    return this.http.post(`vehicle/validate_plaque`, plaqueBody);
  }

  /**
   * Lista de Ventas sin imprimir, se usa cuando se oprime sobre una manguera y se encuentra una venta para imprimir, en ese momento esa venta
   * se guarda en esta lista para no volver a consultarla en el caso de que el Islero oprima botón regresar y luego oprima nuevamente sobre
   * la manguera
   */
  saveListSalesToPrint(listSales: Sale[]) {
    localStorage.setItem('listSalesToPrint', JSON.stringify(listSales));
  }

  readListSalesToPrint(): Sale[] {
    return JSON.parse(localStorage.getItem('listSalesToPrint'));
  }

  closeShift(shiftBody: any) {
    return this.http.post(`shift/close_shift`, shiftBody);
  }

  resumeShift(shiftBody: any) {
    return this.http.post(`shift/resume_shift`, shiftBody);
  }

  /**
   * Turno abierto en esta Isla
   */
  saveIsOpenShift(shift: Shift) {
    localStorage.setItem('isOpenShift', JSON.stringify(shift));
  }

  readIsOpenShift(): Shift {
    return JSON.parse(localStorage.getItem('isOpenShift'));
  }

  /**
   * Llamar Servicio para reenvío de Facturas que tuvieron error al enviar
   */
  forwardInvoice() {
    return this.http.post(`sale/resend_facts`, '');
  }

  /**
   * Llamar Servicio para reenvío de Facturas que tuvieron error al enviar
   */
   forwardInvoiceToSysplus() {
    return this.http.post(`sale/resend_facts_sysplus`, '');
  }

  /**
   * Llamar Servicio para reenvío de Emails a los clientes con la información de la venta
   */
  forwardEmails() {
    return this.http.post(`sale/resend_emails`, '');
  }

  searchUserOrCompany(searchUserOrCompany: { identification: any; type: any }, page: number, quantity: number) {
    let headers = new HttpHeaders();
    headers = headers.set('page', page + '').set('limit', quantity + '');
    return this.http.post(`isle/search_owner`, searchUserOrCompany, {headers});
  }

  saveTypeUser(value: string) {
    localStorage.setItem('typeUser', value);
  }

  readTypeUser(): 'client' | 'company' | string {
    return localStorage.getItem('typeUser');
  }

  saveUserOrCompany(userSelected: User | Company | any) {
    localStorage.setItem('userSelected', JSON.stringify(userSelected));
  }

  readUserOrCompany(): User | Company {
    return JSON.parse(localStorage.getItem('userSelected'));
  }

  deleteUserRegister() {
    localStorage.removeItem('typeUser');
    localStorage.removeItem('userSelected');
  }

  /**
   * Eliminar LocalStorage, todo menos los datos de configuración (IP y Puerto)
   */
  clearShift() {
    localStorage.removeItem('typeUser');
    localStorage.removeItem('userSelected');
    localStorage.removeItem('isOpenShift');
    localStorage.removeItem('island');
    localStorage.removeItem('isleSummary');
    localStorage.removeItem('operator');
    localStorage.removeItem('plaque');
    localStorage.removeItem('saleTotalPrice');
    localStorage.removeItem('listSalesToPrint');
    localStorage.removeItem('idSaleOnInfoOption');
    localStorage.removeItem('isBasketSale');
    localStorage.removeItem('recordCopiesInvoice');
    localStorage.removeItem('saleID');
    localStorage.removeItem('token');
  }

  clearListToPrint(){
    localStorage.removeItem('listSalesToPrint');
  }

  /**
   * Almacena un boolean para saber su la venta que se está realizando es de Canastilla
   */
  saveIsBasketSale(b: boolean) {
    localStorage.setItem('isBasketSale', b + '');
  }

  readIsBasketSale() {
    return localStorage.getItem('isBasketSale');
  }

  /**
   * Almacena la cantidad de copias que se han impreso de una venta para controlar que solo permita imprimir 1 Original y una copia de una misma venta
   */
  saveRecordCopiesInvoice(listRecordCopiesInvoice: RecordCopyInvoice[]) {
    localStorage.setItem('recordCopiesInvoice', JSON.stringify(listRecordCopiesInvoice));
  }

  readRecordCopiesInvoice(): RecordCopyInvoice[] {
    return JSON.parse(localStorage.getItem('recordCopiesInvoice'));
  }

  deleteSaleID(): void {
    localStorage.removeItem('saleID');
  }

  getRolesUser(): Observable<any> {
    return this.http.get<any>("user/list/role", { observe: 'response' });
  }

  consultSalesOfThisHose(body: {hose: string, pump: string, shift: string}) {
    return this.http.post<any>(`sale/search_non_billed/`, body, { observe: 'response' });;
  }

  consultHoseSalesOfIsleInShift(body: {isle: string, shift: string}) {
    return this.http.post<any>(`sale/search_hoses_sales_non_billed_in_shift/`, body, { observe: 'response' });;
  }

  getHistoricalSalesFuel(body: { hoses: string[] }) {
    return this.http.post<any>(`sale/list_most_recent`, body, { observe: 'response' });;
  }

  getHistoricalSalesBasket(body: { isle: string }) {
    return this.http.post<any>(`sale/basket/list_most_recent`, body, { observe: 'response' });
  }

  convertToElectronicInvoice(idSale: string) {
    return this.http.post<any>(`sale/invalidate_convert/${idSale}`, '', { observe: 'response' });
  }

  searchCity(body: { value: any }, page: number, quantity: number) {
    let headers = new HttpHeaders();
    headers = headers.set('page', page + '').set('limit', quantity + '');
    return this.http.post<any>('ubication/search', body, {observe: 'response', headers});
  }
  /**
   * Placa del vehículo con el que se va a realizar la venta
   */
   changePlaque(body:any, sale_id:string) {
    return this.http.put<any>('sale/vehicle/'+sale_id, body, { observe: 'response' });

  }
}
