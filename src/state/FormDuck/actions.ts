import actionCreatorFactory from 'typescript-fsa';
import { DeployItem, DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';
import { AsyncAction, AsyncDispatch } from '../sharedTypes';
import { getApi } from '../sharedSelectors';
import { isSuccessResponse, isErrResponse } from '@eximchain/api-types/spec/responses';
import { fetchDeploys } from '../DeploysDuck/actions';

const actionCreator = actionCreatorFactory('form');

export const resetNewDeploy = actionCreator<void>('reset');

export const updateNewDeploy = actionCreator<{
  field: keyof DeployArgs,
  value: string
}>('update');

export const newDeployLoading = actionCreator<boolean>('loading');

export const setError = actionCreator<any>('error');

export const createDeploy: (args: DeployArgs) => AsyncAction = (args) => {
  return async (dispatch: AsyncDispatch, getState) => {
    dispatch(newDeployLoading(true));
    try {
      const API = getApi(getState());
      const createRes = await API.deploys.create.call(args.ensName, args);
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