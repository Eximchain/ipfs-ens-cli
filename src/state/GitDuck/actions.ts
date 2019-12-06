
import actionCreatorFactory from 'typescript-fsa';
import { GitTypes } from '@eximchain/ipfs-ens-types/spec/deployment';
import { AsyncAction, AsyncDispatch } from '../sharedTypes';
import { getApi } from '../sharedSelectors';
import { isSuccessResponse } from '@eximchain/api-types/spec/responses';

// actionCreator simplifies making all of these actions
// typed.  It requires one generic argument for the payload,
// and one value argument for the type.  They also provide
// "isType" function which accepts an action creator and
// and an action, only returns true if the action was of that type.
const actionCreator = actionCreatorFactory('git');

export const saveAuth = actionCreator<GitTypes.Auth|null>('save-auth');
export const setAuthLoading = actionCreator<boolean>('auth-loading')

export const saveUser = actionCreator<GitTypes.User|null>('save-user');
export const setUserLoading = actionCreator<boolean>('user-loading');

export const saveRepos = actionCreator<GitTypes.Repo[]>('save-repos');
export const setReposLoading = actionCreator<boolean>('repos-loading');

export const saveBranches = actionCreator<{ repo:string, branches: GitTypes.Branch[] }>('save-branches')
export const setBranchesLoading = actionCreator<boolean>('branches-loading');

export const setError = actionCreator<any>('set-error');

export const resetAuth = actionCreator<void>('reset-auth');

export const fetchAuth:(code:string) => AsyncAction = (code) => {
  return async (dispatch:AsyncDispatch, getState) => {
    dispatch(setAuthLoading(true));
    try {
      const API = getApi(getState());
      const authRes = await API.deploys.login.call({code});
      if (isSuccessResponse(authRes)) {
        dispatch(saveAuth(authRes.data))
      } else {
        dispatch(resetAuth());
        dispatch(setError(authRes.err))
      }
    } catch (err) {
      console.log('fetchAuth err: ',err);
      dispatch(resetAuth())
      dispatch(setError(err))
    }
    dispatch(setAuthLoading(false));
  }
}

export const fetchUser:() => AsyncAction = () => {
  return async (dispatch:AsyncDispatch, getState) => {
    dispatch(setUserLoading(true));
    const API = getApi(getState());
    try {
      if (!API.hasAuth()) throw new Error('Cannot fetch user without a token.')
      const user = await API.git.getUser();
      dispatch(saveUser(user));
    } catch (err) {
      console.log('fetchUser err: ',err);
      dispatch(resetAuth())
      dispatch(setError(err));
    }
    dispatch(setUserLoading(false));
  }
}

export const fetchRepos:() => AsyncAction = () => {
  return async (dispatch:AsyncDispatch, getState) => {
    dispatch(setReposLoading(true));
    const API = getApi(getState());
    try {
      if (!API.hasAuth()) throw new Error('Cannot fetch repos without a token.')
      const repos = await API.git.getRepos();
      dispatch(saveRepos(repos));
    } catch (err) {
      console.log('fetchRepos err: ',err);
      dispatch(setError(err))
    }
    dispatch(setReposLoading(false));
  }
}

export const fetchBranches:(owner:string, repo:string) => AsyncAction = (owner, repo) => {
  return async (dispatch:AsyncDispatch, getState) => {
    dispatch(setBranchesLoading(true));
    const API = getApi(getState());
    try {
      if (!API.hasAuth()) throw new Error('Cannot fetch branches without a token.');
      const branches = await API.git.getBranches(owner, repo);
      dispatch(saveBranches({
        repo: `${owner}/${repo}`, branches
      }));
    } catch (err) {
      console.log('fetchBranches err: ',fetchBranches);
      dispatch(setError(err))
    }
    dispatch(setBranchesLoading(false));
  }
}