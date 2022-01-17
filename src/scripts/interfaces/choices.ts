import { Options } from 'deepmerge';
import { Store } from 'redux';
import {
  WrappedInput,
  WrappedSelect,
  Container,
  List,
  Input,
  Dropdown,
} from '../components';
import { Choice } from './choice';
import { Group } from './group';
import { Item } from './item';
import { State } from './state';
import templates from '../templates';

export interface Choices {
  initialised: boolean;
  config: Options;

  passedElement: WrappedInput | WrappedSelect;

  containerOuter: Container;

  containerInner: Container;

  choiceList: List;

  itemList: List;

  input: Input;

  dropdown: Dropdown;

  _isTextElement: boolean;

  _isSelectOneElement: boolean;

  _isSelectMultipleElement: boolean;

  _isSelectElement: boolean;

  _store: Store;

  _templates: typeof templates;

  _initialState: State;

  _currentState: State;

  _prevState: State;

  _currentValue: string;

  _canSearch: boolean;

  _isScrollingOnIe: boolean;

  _highlightPosition: number;

  _wasTap: boolean;

  _isSearching: boolean;

  _placeholderValue: string | null;

  _baseId: string;

  _direction: HTMLElement['dir'];

  _idNames: {
    itemChoice: string;
  };

  _presetGroups: Group[] | HTMLOptGroupElement[] | Element[];

  _presetOptions: Item[] | HTMLOptionElement[];

  _presetChoices: Partial<Choice>[];

  _presetItems: Item[] | string[];

  new (
    element: string | Element | HTMLInputElement | HTMLSelectElement,
    userConfig: Partial<Options>,
  );
}
