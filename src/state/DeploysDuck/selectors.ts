import { createSelector } from 'reselect';
import { getToken } from '../GitDuck/selectors';
import { AppState } from '../store';

export const getDeployState = (state:AppState) => state.deploy;

export const getDeploys = () => createSelector(getDeployState, deploy => deploy.deploys);

export const getDeploy = (deployName:string) => createSelector(getDeploys(), (deploys) => {
  if (deployName in deploys) return deploys[deployName];
  return null;
})

export const isLoading = () => createSelector(getDeployState, deploy => deploy.deploysLoading)

export const getErr = () => createSelector(getDeployState, deploy => deploy.error);

export const getApiUrl = () => createSelector(getDeployState, deploy => deploy.apiUrl);