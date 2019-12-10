import { AsyncAction, AsyncDispatch } from './sharedTypes';
import { DeployActions } from './DeploysDuck';
import { FormActions } from './FormDuck';
import { GitActions } from './GitDuck';

export const clearAllErrors: () => AsyncAction = () => {
  return async (dispatch: AsyncDispatch, getState) => {
    dispatch(DeployActions.setError(null));
    dispatch(FormActions.setError(null));
    dispatch(GitActions.setError(null));
  }
}