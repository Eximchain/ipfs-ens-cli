import { createSelector } from 'reselect';
import APIClient from '@eximchain/ipfs-ens-api-client';
import { AppState } from '../store';

export const getGitState = (state:AppState) => state.git;

export const getAuth = createSelector(getGitState, git => git.auth);
export const getUser = createSelector(getGitState, git => git.user);
export const getRepos = createSelector(getGitState, git => git.repos);
export const getBranches = createSelector(getGitState, git => git.branches);

export const haveAuth = createSelector(getAuth, auth => auth !== null);
export const getToken = createSelector(getAuth, auth => auth ? auth.token : null);

export const isLoading = createSelector(getGitState, git => {
  return {
    auth: git.authLoading,
    repos: git.reposLoading,
    branches: git.branchesLoading,
    user: git.userLoading
  }
})

export const getErr = createSelector(getGitState, git => git.error);