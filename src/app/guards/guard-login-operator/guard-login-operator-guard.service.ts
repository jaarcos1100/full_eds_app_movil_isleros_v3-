import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {OperatorService} from '../../services/operator/operator.service';
import {ToastService} from '../../services/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class GuardLoginOperator implements CanActivate {

  constructor(
    private operatorService: OperatorService,
    private router: Router,
    private toastService: ToastService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const operator = this.operatorService.readLocalHostOperator();
    console.log(operator);
    if (operator) {
      const roles = operator?.roles;
      if (roles) {
        for (const role of roles) {
          if (role.role?.level === 3) {
            return true;
          }
        }
      }
    }
    this.toastService.presentToastError('No Autorizado');
    this.router.navigate(['operator']);
    this.operatorService.clearShift();
    return false;
    // return true;
  }
}
