import { reducerWithInitialState } from "typescript-fsa-reducers";
import { newDeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';
import { shallowMerge } from '../sharedTypes';
import { FormState } from './types';
import { 
  resetNewDeploy, updateNewDeploy, newDeployLoading, setError
} from './actions';

const initialState:FormState = {
  error: null,
  newDeploy: newDeployArgs(),
  loading: false
}

export const DeployReducer = reducerWithInitialState(initialState)
  .case(resetNewDeploy, (state) => shallowMerge(state, { newDeploy : newDeployArgs() }))
  .case(updateNewDeploy, (state, { field, value }) => shallowMerge(state, {
    newDeploy: shallowMerge(state.newDeploy, { [field] : value })
  }))
  .case(newDeployLoading, (state, newDeployLoading) => shallowMerge(state, { newDeployLoading }))
  .case(setError, (state, error) => shallowMerge(state, { error }))

export default DeployReducer;