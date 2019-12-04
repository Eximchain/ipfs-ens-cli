import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
import GitReducer, { GitTypes } from './GitDuck';
import DeployReducer, { DeployTypes } from './DeployDuck';

export interface AppState {
  deploy: DeployTypes.DeployState
  git: GitTypes.GitState
}

const rootReducer = combineReducers({
  deploy: DeployReducer,
  git: GitReducer
});

export default function makeStore(initialState?: AppState) {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(
      thunkMiddleware
    )),
  );
}