import {Isle} from '../isle/isle';
import {Pump} from '../pump/pump';
import {Side} from '../side/Side';
import {Hose} from '../hose/hose';

export interface IsleSummary {
  isle: Isle;
  pumps: Pump[];
  sides: Side[];
  hoses: Hose[];
  canasta: boolean;
}
