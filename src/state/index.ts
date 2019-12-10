import makeStore from './store';

export default makeStore;

export * from './store';
export * from './DeploysDuck';
export * from './FormDuck';
export * from './GitDuck';

import * as Selectors from './sharedSelectors';
export import SharedSelectors = Selectors;

import * as Types from './sharedTypes';
export import SharedTypes = Types;

import * as Actions from './sharedActions';
export import SharedActions = Actions;