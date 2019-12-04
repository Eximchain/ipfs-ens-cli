import actionCreatorFactory from 'typescript-fsa';
import { asyncFactory } from 'typescript-fsa-redux-thunk';
import { DeployItem, DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';
import { AsyncAction, AsyncDispatch } from '../sharedTypes';
import { getApi } from '../GitDuck/selectors';
import { AppState } from '../store';
import { isSuccessResponse, isErrResponse } from '@eximchain/api-types/spec/responses';

// What's 'typescript-fsa'?
//
// actionCreator simplifies making all of these actions
// typed.  It requires one generic argument for the payload,
// and one value argument for the type.  They also provide
// "isType" function which accepts an action creator and
// and an action, only returns true if the action was of that type.
const actionCreator = actionCreatorFactory('deploy');

export const resetNewDeploy = actionCreator<void>('reset-new');

export const updateNewDeploy = actionCreator<{
  field: keyof DeployArgs,
  value: string
}>('update-new');

export const saveDeploys = actionCreator<DeployItem[]>('save-deploys');

export const deploysLoading = actionCreator<boolean>('deploys-loading');

export const newDeployLoading = actionCreator<boolean>('new-deploy-loading');

export const setError = actionCreator<any>('set-err');

export const fetchDeploys: () => AsyncAction = () => {
  return async (dispatch: AsyncDispatch, getState) => {
    dispatch(deploysLoading(true));
    try {
      const API = getApi(getState());
      const listRes = await API.deploys.list.call();
      if (isSuccessResponse(listRes)) {
        dispatch(saveDeploys(listRes.data.items));
      } else {
        dispatch(setError(listRes.err))
      }
    } catch (err) {
      dispatch(setError(err))
    }
    dispatch(deploysLoading(false));
  }
}

export const fetchDeploy: (name: string) => AsyncAction = (name) => {
  return async (dispatch: AsyncDispatch, getState) => {
    dispatch(deploysLoading(true));
    try {
      const API = getApi(getState());
      const readRes = await API.deploys.read.call(name);
      if (isSuccessResponse(readRes) && readRes.data.exists) {
        dispatch(saveDeploys([readRes.data.item]));
      } else if (isErrResponse(readRes)) {
        dispatch(setError(readRes.err));
      }
    } catch (err) {
      dispatch(setError(err));
    }
    dispatch(deploysLoading(false));
  }
}

export const createDeploy: (args: DeployArgs) => AsyncAction = (args) => {
  return async (dispatch: AsyncDispatch, getState) => {
    dispatch(newDeployLoading(true));
    try {
      const API = getApi(getState());
      const createRes = await API.deploys.create.call(args.ensName, args);
      console.log('We got a create response', createRes);
      console.log('Throwing away newDeploy: ',args);
      dispatch(resetNewDeploy());
    } catch (err) {
      dispatch(setError(err));
    }
    dispatch(newDeployLoading(false));

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