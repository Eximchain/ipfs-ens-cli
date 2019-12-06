import { reducerWithInitialState } from "typescript-fsa-reducers";
import keyBy from 'lodash.keyby';
import { newDeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';
import { shallowMerge } from '../sharedTypes';
import { DeployState } from './types';
import { 
  resetNewDeploy, updateNewDeploy, saveDeploys,
  deploysLoading, newDeployLoading, setError, setApiUrl
} from './actions';

const initialState:DeployState = {
  deploys: {},
  error: null,
  deploysLoading: false,
  newDeploy: newDeployArgs(),
  newDeployLoading: false,
  apiUrl: 'https://ipfs-api-johno.eximchain-dev.com'
}

export const DeployReducer = reducerWithInitialState(initialState)
  .case(resetNewDeploy, (state) => shallowMerge(state, { newDeploy : newDeployArgs() }))
  .case(updateNewDeploy, (state, { field, value }) => shallowMerge(state, {
    newDeploy: shallowMerge(state.newDeploy, { [field] : value })
  }))
  .case(saveDeploys, (state, deploys) => shallowMerge(state, {
    deploys: keyBy(deploys, deploy => deploy.ensName)
  }))
  .case(deploysLoading, (state, deploysLoading) => shallowMerge(state, { deploysLoading }))
  .case(newDeployLoading, (state, newDeployLoading) => shallowMerge(state, { newDeployLoading }))
  .case(setError, (state, error) => shallowMerge(state, { error }))
  .case(setApiUrl, (state, apiUrl) => shallowMerge(state, { apiUrl }))

export default DeployReducer;