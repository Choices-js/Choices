import { SetIsLoadingAction } from '../actions/misc';
import { State } from '../interfaces/state';
export declare const defaultState = false;
type ActionTypes = SetIsLoadingAction | Record<string, never>;
declare const general: (state?: boolean, action?: ActionTypes) => State['loading'];
export default general;
//# sourceMappingURL=loading.d.ts.map