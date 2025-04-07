import { Component, OnInit } from '@angular/core';
import {OperatorService} from '../../../services/operator/operator.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Pump} from '../../../models/pump/pump';
import {Isle} from '../../../models/isle/isle';
import {IsleSummary} from '../../../models/isle-summary/IsleSummary';
import {Hose, ShiftHose} from '../../../models/hose/hose';
import {VolumeHose} from '../../../models/volume-hose/VolumeHose';
import {OpenShift} from '../../../models/shift/Shift';
import {HttpErrorResponse} from '@angular/common/http';
import {Side} from '../../../models/side/Side';
import {ToastService} from '../../../services/toast/toast.service';
import {LoadingService} from '../../../services/loading/loading.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  preload = false;
  errorMessage: string;
  // listPump: Pump[] = [
  //   {_id: '2131', id_pump: 1, name: 'Gasolina', hoses: [
  //       {name: 'Hose 1', product: {name: 'Gasolina', value: 9000}},
  //       {name: 'Hose 2'},
  //       {name: 'Hose 3'},
  //       {name: 'Hose 4'},
  //     ]},
  //   {_id: '2131', id_pump: 1, name: 'Gasolina', hoses: [{name: 'asdad'}]},
  // ];
  isleSummary: IsleSummary;
  public volumes: VolumeHose[];
  public isAccessAfterLogin: boolean;

  constructor(
    public navCtrl: NavController,
    private operatorService: OperatorService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {
    // this.isleSummary = JSON.parse('{"isle":{"_id":"5f73dff6a4393d0bffc95b3b","id_isle":1,"name":"Isla 1","__v":0},"pumps":[{"_id":"5f73e00d03c9570c1040bc54","id_pump":1,"name":"Isla_1_surtidor_1","isle":{"_id":"5f73dff6a4393d0bffc95b3b","id_isle":1,"name":"Isla 1","__v":0},"__v":0},{"_id":"5f73e09503c9570c1040bc5b","id_pump":2,"name":"Isla_1_surtidor_2","isle":{"_id":"5f73dff6a4393d0bffc95b3b","id_isle":1,"name":"Isla 1","__v":0},"__v":0}],"sides":[{"_id":"5f73e00d03c9570c1040bc55","pump":{"_id":"5f73e00d03c9570c1040bc54","id_pump":1,"name":"Isla_1_surtidor_1","isle":"5f73dff6a4393d0bffc95b3b","__v":0},"id_side":1,"__v":0},{"_id":"5f73e00d03c9570c1040bc58","pump":{"_id":"5f73e00d03c9570c1040bc54","id_pump":1,"name":"Isla_1_surtidor_1","isle":"5f73dff6a4393d0bffc95b3b","__v":0},"id_side":2,"__v":0},{"_id":"5f73e09503c9570c1040bc5c","pump":{"_id":"5f73e09503c9570c1040bc5b","id_pump":2,"name":"Isla_1_surtidor_2","isle":"5f73dff6a4393d0bffc95b3b","__v":0},"id_side":3,"__v":0},{"_id":"5f73e09503c9570c1040bc5e","pump":{"_id":"5f73e09503c9570c1040bc5b","id_pump":2,"name":"Isla_1_surtidor_2","isle":"5f73dff6a4393d0bffc95b3b","__v":0},"id_side":4,"__v":0}],"hoses":[{"_id":"5f73e00d03c9570c1040bc56","side":{"_id":"5f73e00d03c9570c1040bc55","pump":"5f73e00d03c9570c1040bc54","id_side":1,"__v":0},"__v":0,"id_hose":1,"product":{"value":8359,"stock":0,"points":0,"taxes":[],"withholdings":[],"_id":"5f73da87a4393d0bffc95b34","code":"003","name":"Diesel1","description":"Combustible","category":"5f73da87a4393d0bffc95b30","organization":"5f73da87a4393d0bffc95b2f","__v":0}},{"_id":"5f73e00d03c9570c1040bc57","side":{"_id":"5f73e00d03c9570c1040bc55","pump":"5f73e00d03c9570c1040bc54","id_side":1,"__v":0},"__v":0,"id_hose":2,"product":{"value":8379,"stock":0,"points":0,"taxes":[],"withholdings":[],"_id":"5f73da87a4393d0bffc95b33","code":"002","name":"Gasolina1","description":"Combustible","category":"5f73da87a4393d0bffc95b30","organization":"5f73da87a4393d0bffc95b2f","__v":0}},{"_id":"5f73e00d03c9570c1040bc59","side":{"_id":"5f73e00d03c9570c1040bc58","pump":"5f73e00d03c9570c1040bc54","id_side":2,"__v":0},"__v":0,"id_hose":4,"product":{"value":8359,"stock":0,"points":0,"taxes":[],"withholdings":[],"_id":"5f73da87a4393d0bffc95b34","code":"003","name":"Diesel1","description":"Combustible","category":"5f73da87a4393d0bffc95b30","organization":"5f73da87a4393d0bffc95b2f","__v":0}},{"_id":"5f73e00d03c9570c1040bc5a","side":{"_id":"5f73e00d03c9570c1040bc58","pump":"5f73e00d03c9570c1040bc54","id_side":2,"__v":0},"__v":0,"id_hose":5,"product":{"value":8379,"stock":0,"points":0,"taxes":[],"withholdings":[],"_id":"5f73da87a4393d0bffc95b33","code":"002","name":"Gasolina1","description":"Combustible","category":"5f73da87a4393d0bffc95b30","organization":"5f73da87a4393d0bffc95b2f","__v":0}},{"_id":"5f73e09503c9570c1040bc5d","side":{"_id":"5f73e09503c9570c1040bc5c","pump":"5f73e09503c9570c1040bc5b","id_side":3,"__v":0},"__v":0,"id_hose":7,"product":{"value":1800,"stock":0,"points":0,"taxes":[],"withholdings":[],"_id":"602af35a0016451a4039e68f","name":"UREA1","category":"5f73da87a4393d0bffc95b30","organization":"5f73e0f7a4393d0bffc95b3c","description":"Aditivo","code":"012","__v":0}},{"_id":"5f73e09503c9570c1040bc5f","side":{"_id":"5f73e09503c9570c1040bc5e","pump":"5f73e09503c9570c1040bc5b","id_side":4,"__v":0},"__v":0,"id_hose":10,"product":{"value":1800,"stock":0,"points":0,"taxes":[],"withholdings":[],"_id":"602af35a0016451a4039e68f","name":"UREA1","category":"5f73da87a4393d0bffc95b30","organization":"5f73e0f7a4393d0bffc95b3c","description":"Aditivo","code":"012","__v":0}},{"_id":"6024339124a2ba382ce05e92","side":{"_id":"5f73e00d03c9570c1040bc55","pump":"5f73e00d03c9570c1040bc54","id_side":1,"__v":0},"__v":0,"id_hose":3,"product":{"value":8359,"stock":0,"points":0,"taxes":[],"withholdings":[],"_id":"5f73da87a4393d0bffc95b34","code":"003","name":"Diesel1","description":"Combustible","category":"5f73da87a4393d0bffc95b30","organization":"5f73da87a4393d0bffc95b2f","__v":0}},{"_id":"602433b224a2ba382ce05e93","side":{"_id":"5f73e00d03c9570c1040bc58","pump":"5f73e00d03c9570c1040bc54","id_side":2,"__v":0},"__v":0,"id_hose":6,"product":{"value":8359,"stock":0,"points":0,"taxes":[],"withholdings":[],"_id":"5f73da87a4393d0bffc95b34","code":"003","name":"Diesel1","description":"Combustible","category":"5f73da87a4393d0bffc95b30","organization":"5f73da87a4393d0bffc95b2f","__v":0}}],"canasta":true}');
    // this.volumes = JSON.parse('[{"pump":{"name":"Isla_1_surtidor_1","id_pump":1},"hose":{"_id":"602433b224a2ba382ce05e93","id_hose":6,"product":"Diesel1","volume":46997.91}},{"pump":{"name":"Isla_1_surtidor_1","id_pump":1},"hose":{"_id":"5f73e00d03c9570c1040bc56","id_hose":1,"product":"Diesel1","volume":1917220.06}},{"pump":{"name":"Isla_1_surtidor_1","id_pump":1},"hose":{"_id":"5f73e00d03c9570c1040bc57","id_hose":2,"product":"Gasolina1","volume":158296.17}},{"pump":{"name":"Isla_1_surtidor_1","id_pump":1},"hose":{"_id":"6024339124a2ba382ce05e92","id_hose":3,"product":"Diesel1","volume":22729.92}},{"pump":{"name":"Isla_1_surtidor_1","id_pump":1},"hose":{"_id":"5f73e00d03c9570c1040bc5a","id_hose":5,"product":"Gasolina1","volume":88958.41}},{"pump":{"name":"Isla_1_surtidor_1","id_pump":1},"hose":{"_id":"5f73e00d03c9570c1040bc59","id_hose":4,"product":"Diesel1","volume":2340722.95}},{"pump":{"name":"Isla_1_surtidor_2","id_pump":2},"hose":{"_id":"5f73e09503c9570c1040bc5d","id_hose":7,"product":"UREA1","volume":2894.35}},{"pump":{"name":"Isla_1_surtidor_2","id_pump":2},"hose":{"_id":"5f73e09503c9570c1040bc5f","id_hose":10,"product":"UREA1","volume":0}}]');

    this.isAccessAfterLogin = !!this.route.snapshot.paramMap.get('isCurrent');

    this.getSummary();

    // const side: Side[] = [
    //   {_id: 's1', id_side: 1, name: 'lado 1'},
    //   {_id: 's2', id_side: 2, name: 'lado 2'},
    //   {_id: 's3', id_side: 1, name: 'lado 1'},
    //   {_id: 's4', id_side: 2, name: 'lado 2'},
    // ];
    //
    // const hoses: Hose[] = [
    //   {_id: 'h3', side: side[0], name: 'hose 2', id_hose: 2},
    //   {_id: 'h2', side: side[1], name: 'hose 3', id_hose: 3},
    //   {_id: 'h1', side: side[0], name: 'hose 1', id_hose: 1},
    //   {_id: 'h4', side: side[1], name: 'hose 4', id_hose: 4},
    //   {_id: 'h5', side: side[2], name: 'hose 5', id_hose: 5},
    //   {_id: 'h6', side: side[2], name: 'hose 6', id_hose: 6},
    //   {_id: 'h7', side: side[3], name: 'hose 7', id_hose: 7},
    //   // {_id: 'h8', side: side[3], name: 'hose 8', id_hose: 8},
    // ];
    //
    // const pumps: Pump[] = [
    //   {name: 'pump 1', _id: 'p1', id_pump: 1},
    //   {name: 'pump 2', _id: 'p2', id_pump: 2},
    // ];
    //
    // side[0].pump = pumps[0]._id;
    // side[1].pump = pumps[0]._id;
    //
    // side[2].pump = pumps[1]._id;
    // side[3].pump = pumps[1]._id;
    //
    // this.isleSummary = {
    //   sides: side,
    //   hoses: hoses,
    //   pumps: pumps
    // };
    //
    // this.volumes = [];
  }

  /**
   * Consulta ls información de la Isla usando el _id, luego consulta los volúmenes de las Mangueras usando el id_isle (id generado no por la Base de Datos sino por el
   * administrador cuando crea las Islas), se usan un id diferente al de la base de datos ya que es más fácil para las tarjetas
   * Hardware reconocer la Isla
   */
  public getSummary() {
    this.startLoading();
    this.preload = true;
    this.errorMessage = undefined;
    const isle: Isle = this.operatorService.readLocalHostIsland();
    this.operatorService.getSummary(isle._id).subscribe(
      (value: any) => {
        console.log(value);
        this.isleSummary = value.body;
        if (!this.isAccessAfterLogin) {
          this.operatorService.saveIsleSummary(this.isleSummary);
        }
        this.operatorService.getVolumes(isle.id_isle).subscribe(
          (value1: any) => {
            console.log(value1);
            this.preload = false;
            this.loadingService.dismissLoading();
            this.volumes = value1.body;
            if (this.volumes) {
              for (const hose of this.isleSummary.hoses) {
                for (const volume of this.volumes) {
                  if (volume.hose?.id_hose === hose.id_hose) {
                    // @ts-ignore
                    hose.volume = volume.hose.volume;
                    break;
                  }
                }
              }
            }
          },
          error => {
            this.preload = false;
            this.toastService.presentToastError('Error obteniendo el resumen, por favor intente nuevamente');
          }
        );
      },
      error => {
        this.preload = false;
        this.toastService.presentToastError('Error obteniendo el resumen, por favor intente nuevamente');
      }
    );
  }

  private startLoading() {
    this.loadingService.presentLoading().then(() => {
      this.stopLoading();
    });
  }

  stopLoading() {
    const interval = setInterval(() => {
      if (this.preload === false) {
        clearInterval(interval);
        this.loadingService.dismissLoading();
      }
    }, 500);
  }

  getHosesForOpenShift(): ShiftHose[] {
    const shiftHose: ShiftHose[] = [];
    for (const volume of this.volumes) {
      const hose: Hose = this.isleSummary.hoses.find(h => h.id_hose === volume.hose?.id_hose);
      shiftHose.push({
        hose: hose._id,
        // @ts-ignore
        volume: volume.hose.volume
      });
    }
    return shiftHose;
  }

  buildShift(): OpenShift {
    return {
      user: this.operatorService.readLocalHostOperator()?._id,
      isle: this.operatorService.readLocalHostIsland()?._id,
      hoses: this.getHosesForOpenShift()
    };
  }

  /**
   * Acción al oprimir sobre el botón Continuar, Abre turno en la Base de Datos y redirige al lobby
   */
  next() {
    if (!(this.isleSummary?.hoses?.length > 0)) {
      this.errorMessage = 'La isla no tinen mangueras registradas';
      return;
    }
    this.preload = true;
    this.startLoading();
    this.errorMessage = undefined;
    const shiftBody = this.buildShift();
    console.log(shiftBody);
    this.operatorService.openShift(shiftBody).subscribe(
      (value: any) => {
        this.operatorService.saveIsOpenShift(value.body.shift);
        this.preload = false;
        // this.router.navigate(['operator/lobby']);
        this.navCtrl.navigateRoot('operator/lobby');
      },
      (error: HttpErrorResponse) => {
        this.preload = false;
        // if (error.status === 400) {
        //   this.errorMessage = 'La cédula no se encuentra registrada';
        // } else {
        // }
        this.toastService.presentToastError('No se logró iniciar el turno, por favor intente nuevamente');
      }
    );
  }

  getHosesOfPump(pump: Pump): Hose[] {
    const hoses: Hose[] = [];
    for (const hose of this.isleSummary.hoses) {
      if (hose.side.pump === pump._id) {
        hoses.push(hose);
      }
    }
    return hoses.sort((h1, h2) => h1.id_hose - h2.id_hose);
  }

  getHosesOfPumpAndSide(pump: Pump, indexSide: number): Hose[] {
    const hoses: Hose[] = [];
    let sidesOfThisPump: Side[] = this.isleSummary.sides?.filter(s => s.pump?._id === pump._id);
    if (sidesOfThisPump) {
      sidesOfThisPump.sort((s1, s2) => s1.id_side - s2.id_side);
    } else {
      sidesOfThisPump = [];
    }
    // console.log(this.isleSummary.hoses.sort((l1, l2) => l1.side.id_side - l2.side.id_side));
    for (const hose of this.isleSummary.hoses.sort((l1, l2) => l1.side.id_side - l2.side.id_side)) {
      // console.log(hose, hose.side.pump, pump._id, hose.side.id_side, indexSide, hose.side.pump === pump._id, hose.side.id_side === sidesOfThisPump[indexSide].id_side);
      if (hose.side.pump === pump._id && hose.side.id_side === sidesOfThisPump[indexSide].id_side) {
        hoses.push(hose);
      }
    }
    // console.log(hoses);
    return hoses.sort((h1, h2) => h1.id_hose - h2.id_hose);
  }
}
