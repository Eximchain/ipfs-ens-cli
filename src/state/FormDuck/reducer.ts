import { reducerWithInitialState } from "typescript-fsa-reducers";
import { newDeployArgs, DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';
import { shallowMerge } from '../sharedTypes';
import { FormState } from './types';
import { 
  resetNewDeploy, updateNewDeploy, newDeployLoading, setError, updateMultiple
} from './actions';

const initialState:FormState = {
  error: null,
  newDeploy: newDeployArgs(),
  loading: false
}

export const DeployReducer = reducerWithInitialState(initialState)
  .case(resetNewDeploy, (state) => shallowMerge(state, { newDeploy : newDeployArgs() }))
  .case(newDeployLoading, (state, newDeployLoading) => shallowMerge(state, { newDeployLoading }))
  .case(setError, (state, error) => shallowMerge(state, { error }))
  .case(updateNewDeploy, (state, { field, value }) => shallowMerge(state, {
    newDeploy: shallowMerge(state.newDeploy, { [field] : value })
  }))
  .case(updateMultiple, (state, updates) => shallowMerge(state, {
    newDeploy: shallowMerge(state.newDeploy, updates.reduce((newVals, update) => {
      const [field, value] = update;
      if (field === 'sourceProvider') return newVals;
      newVals[field] = value;
      return newVals;
    }, {} as Partial<DeployArgs>))
  }))

export default DeployReducer;