import { SetIsLoadingAction } from '../actions/misc';
import { State } from '../interfaces/state';
type ActionTypes = SetIsLoadingAction | Record<string, never>;
declare const general: (state?: number, action?: ActionTypes) => State["loading"];
export default general;
