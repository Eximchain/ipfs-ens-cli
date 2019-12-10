import { createSelector } from 'reselect';
import { getToken } from '../GitDuck/selectors';
import { AppState } from '../store';

export const getDeployState = (state:AppState) => state.deploy;

export const getDeploys = () => createSelector(getDeployState, deploy => deploy.deploys);

export const getDeploy = (deployName:string) => createSelector(getDeploys(), (deploys) => {
  return deploys[deployName];
})

export const isLoading = () => createSelector(getDeployState, deploy => deploy.deploysLoading)

export const getErr = () => createSelector(getDeployState, deploy => deploy.error);

export const getApiUrl = () => createSelector(getDeployState, deploy => deploy.apiUrl);