import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Island} from '../../models/island/Island';
import {Isle} from '../../models/isle/isle';
import {OperatorLogin} from '../../models/operator-login/OperatorLogin';
import {IsleSummary} from '../../models/isle-summary/IsleSummary';
import {RegisterSale} from '../../models/register-sale/RegisterSale';
import {User} from '../../models/user/user';
import {OpenShift} from '../../models/shift/Shift';
import {Sale} from '../../models/sale/sale';
import {Company} from '../../models/company/company';
import {Global} from '../../models/global/global';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageIpPortService {

  constructor() { }

  static readIp(): string {
    return JSON.parse(localStorage.getItem('ipApi'));
  }

  static readPort(): number {
    return JSON.parse(localStorage.getItem('portApi'));
  }

  static getIsPrint() {
    return JSON.parse(localStorage.getItem('isPrint'));
  }

  setIsPrint(is_print) {
    localStorage.setItem('isPrint', JSON.stringify(is_print));
  }

  static getIsDatafono() {
    return JSON.parse(localStorage.getItem('isDatafono'));
  }

  setIsDatafono(is_datafone) {
    localStorage.setItem('isDatafono', JSON.stringify(is_datafone));
  }

  static readAddress() {
    if (!this.readIp() || !this.readPort()) {
      return undefined;
    }
    return this.readIp() + ':' + this.readPort() + '/';
  }

  static readAddressSocket() {
    if (!this.readIp() || !this.readPort()) {
      return undefined;
    }
    return 'ws://' + this.readIpWithoutHttp() + ':' + this.readPort() + '/';
  }

  static readIpWithoutHttp() {
    return this.readIp().replace('http://', '').replace('http:/', '')
      .replace('https://', '').replace('https:/', '');
  }

  saveIp(ip: string) {
    localStorage.setItem('ipApi', JSON.stringify(ip));
  }

  savePort(port: number) {
    localStorage.setItem('portApi', JSON.stringify(port));
  }
}
