import {Pump} from '../pump/pump';

export interface Side {
  _id: string;
  id_side: number;
  name: number;
  pump: Pump | any;
}
