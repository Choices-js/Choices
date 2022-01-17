import { Choice } from './choice';
import { Group } from './group';
import { Item } from './item';

export interface State {
  choices: Choice[];
  groups: Group[];
  items: Item[];
  loading: boolean;
}
