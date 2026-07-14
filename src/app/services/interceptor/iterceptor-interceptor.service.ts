import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Global} from '../../models/global/global';
import {catchError, timeout} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LocalStorageIpPortService} from '../localStorageIpPort/local-storage-ip-port.service';
import {ToastService} from '../toast/toast.service';
import {NavController} from '@ionic/angular';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(public navCtrl: NavController, private localStorageIpPortService: LocalStorageIpPortService, private toastService: ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: any = JSON.parse(localStorage.getItem('token'));
    if (token) {
      request = this.addToken(request, token.access_token);
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }
    if (request.url !== '/assets/i18n/en.json' && request.url !== '/assets/i18n/es.json') {
      const savedIp = LocalStorageIpPortService.readAddress();
      // const endpoint = savedIp ? savedIp : Global.URL.endpoint;
      request = request.clone({
        url: savedIp + request.url
      });
    }

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.navCtrl.navigateRoot('');
        // return this.handle401Error(request, next);
      } else if (error instanceof HttpErrorResponse && error.status === 403) {
        this.navCtrl.navigateRoot('');
      }
      return throwError(error);
    }),
      timeout(30000));
  }

  /**
   * Agrega token
   */
  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('authorization', `${token}`)
    });
  }
}
