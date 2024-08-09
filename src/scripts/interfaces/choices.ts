import {
  WrappedInput,
  WrappedSelect,
  Container,
  List,
  Input,
  Dropdown,
} from '../components';
import { Store } from './store';
import { InputChoice } from './input-choice';
import { State } from './state';
import { Templates } from './templates';
import { ChoiceFull } from './choice-full';
import { GroupFull } from './group-full';
import { Options } from './options';
import { SearchHandler } from './search';

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

  _templates: Templates;

  _initialState: State;

  _currentState: State;

  _prevState: State;

  _lastAddedChoiceId: number;

  _lastAddedGroupId: number;

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

  _presetChoices: (ChoiceFull | GroupFull)[];

  _presetItems: (InputChoice | string)[];

  _initialItems: string[];

  _searchFn: SearchHandler;
}
