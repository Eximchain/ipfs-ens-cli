import { Action } from 'redux';
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { AppState } from "./store";

export type AsyncDispatch = ThunkDispatch<AppState, {}, Action>
export type AsyncAction = ThunkAction<Promise<void>, AppState, {}, Action>

/**
 * Sugar for Object.assign({}, state, val), the
 * cleanest way to shallowMerge object in JS.
 * @param state 
 * @param val 
 */
export function shallowMerge<State extends object, Payload extends object>(state:State, val:Payload) {
  return Object.assign({}, state, val);
}