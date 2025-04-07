import {ShiftHose} from '../hose/hose';

export interface OpenShift {
  user: string;
  isle: string;
  id_shift?: string;
  hoses: ShiftHose[];
}

export interface Shift {
  _id: string;
}
