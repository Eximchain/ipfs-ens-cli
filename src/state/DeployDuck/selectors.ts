import { createSelector } from 'reselect';
import { getToken } from '../GitDuck/selectors';
import { AppState } from '../store';

export const getDeployState = (state:AppState) => state.deploy;

export const getDeploys = createSelector(getDeployState, deploy => deploy.deploys);

export const getDeploy = (deployName:string) => createSelector(getDeploys, (deploys) => {
  return deploys[deployName];
})

export const getNewDeploy = createSelector(getDeployState, deploy => deploy.newDeploy);

export const newDeployValid = createSelector(getNewDeploy, newDeploy => {
  return Object.values(newDeploy).every(val => val !== '')
})

export const isLoading = {
  deploys: createSelector(getDeployState, deploy => deploy.deploysLoading),
  newDeploy: createSelector(getDeployState, deploy => deploy.newDeployLoading)
}

export const getErr = createSelector(getDeployState, deploy => deploy.error);