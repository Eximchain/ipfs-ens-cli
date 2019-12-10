import { reducerWithInitialState } from "typescript-fsa-reducers";
import keyBy from 'lodash.keyby';
import { shallowMerge } from '../sharedTypes';
import { DeployState } from './types';
import { 
  saveDeploys, deploysLoading, setError, setApiUrl
} from './actions';

const initialState:DeployState = {
  deploys: {},
  error: null,
  deploysLoading: false,
  apiUrl: 'https://ipfs-api-johno.eximchain-dev.com'
}

export const DeployReducer = reducerWithInitialState(initialState)
  .case(saveDeploys, (state, deploys) => shallowMerge(state, {
    deploys: keyBy(deploys, deploy => deploy.ensName)
  }))
  .case(deploysLoading, (state, deploysLoading) => shallowMerge(state, { deploysLoading }))
  .case(setError, (state, error) => shallowMerge(state, { error }))
  .case(setApiUrl, (state, apiUrl) => shallowMerge(state, { apiUrl }))

export default DeployReducer;