import path from 'path';
import { createStore, applyMiddleware, combineReducers } from "redux";
import { AsyncNodeStorage } from 'redux-persist-node-storage'
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import thunkMiddleware from "redux-thunk";
import GitReducer, { GitTypes } from './GitDuck';
import DeployReducer, { DeployTypes } from './DeploysDuck';
import FormReducer, { FormState } from './FormDuck';

export interface AppState {
  deploy: DeployTypes.DeployState
  git: GitTypes.GitState
  form: FormState
}

const rootReducer = combineReducers({
  deploy: DeployReducer,
  git: GitReducer,
  form: FormReducer
});

const INSTALL_PATH = __dirname;

const STATE_PATH = path.resolve(INSTALL_PATH, './redux-state')

const persistConfig:PersistConfig<AppState> = {
  key: 'root',
  storage: new AsyncNodeStorage(STATE_PATH),
  blacklist: ['form']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function makeStore(initialState?: AppState) {
  const store = createStore(
    persistedReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware
    ),
  );
  const persistor = persistStore(store);
  return { store, persistor }
}