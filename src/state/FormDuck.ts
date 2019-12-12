import actionCreatorFactory from 'typescript-fsa';
import { DeployArgs, newDeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';
import { AsyncAction, AsyncDispatch } from './sharedTypes';
import { getApi } from './sharedSelectors';
import { fetchDeploys } from './DeploysDuck/actions';
import { createSelector } from 'reselect';
import { AppState } from './store';
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { shallowMerge } from './sharedTypes';

export interface FormState {
  newDeploy: DeployArgs
  loading: boolean
  error: null | any
}

const initialState:FormState = {
  error: null,
  newDeploy: newDeployArgs(),
  loading: false
}

export namespace FormActions {
  const actionCreator = actionCreatorFactory('form');

  export const reset = actionCreator<void>('reset');
  
  export const update = actionCreator<{
    field: keyof DeployArgs,
    value: string
  }>('update');
  
  export const updateMultiple = actionCreator<[keyof DeployArgs, string][]>('update-multiple')
  
  export const setLoading = actionCreator<boolean>('loading');
  
  export const setError = actionCreator<any>('error');
  
  export const submit: () => AsyncAction = () => {
    return async (dispatch: AsyncDispatch, getState) => {
      dispatch(setLoading(true));
      try {
        const state = getState();
        const API = getApi(state);
        const args = FormSelectors.getArgs()(state);
        const createRes = await API.deploys.create.call(args.ensName, args);
        dispatch(reset());
      } catch (err) {
        dispatch(setError(err));
      }
      dispatch(setLoading(false));
  
      // Wait for 3/4s of a second then refresh our deploy list
      await sleep(750);
      dispatch(fetchDeploys())
    }
  }
  
  function sleep(ms: number) {
    return new Promise((res) => {
      setTimeout(() => res(null), ms);
    })
  } 
}

export const FormReducer = reducerWithInitialState(initialState)
  .case(FormActions.reset, (state) => shallowMerge(state, { newDeploy : newDeployArgs() }))
  .case(FormActions.setLoading, (state, newDeployLoading) => shallowMerge(state, { newDeployLoading }))
  .case(FormActions.setError, (state, error) => shallowMerge(state, { error }))
  .case(FormActions.update, (state, { field, value }) => shallowMerge(state, {
    newDeploy: shallowMerge(state.newDeploy, { [field] : value })
  }))
  .case(FormActions.updateMultiple, (state, updates) => shallowMerge(state, {
    newDeploy: shallowMerge(state.newDeploy, updates.reduce((newVals, update) => {
      const [field, value] = update;
      if (field === 'sourceProvider') return newVals;
      newVals[field] = value;
      return newVals;
    }, {} as Partial<DeployArgs>))
  }))

export namespace FormSelectors {
  const getFormState = (state:AppState) => state.form;

  export const getArgs = () => createSelector(getFormState, form => form.newDeploy);
  
  export const newDeployValid = createSelector(getArgs(), newDeploy => {
    return Object.values(newDeploy).every(val => val !== '')
  })
  
  export const getErr = () => createSelector(getFormState, form => form.error);
  
  export const isLoading = () => createSelector(getFormState, form => form.loading);
}

export default FormReducer;