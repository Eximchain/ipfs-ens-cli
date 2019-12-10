import { createSelector } from 'reselect';
import { AppState } from '../store';

export const getFormState = (state:AppState) => state.form;

export const getNewDeploy = () => createSelector(getFormState, form => form.newDeploy);

export const newDeployValid = createSelector(getNewDeploy(), newDeploy => {
  return Object.values(newDeploy).every(val => val !== '')
})

export const getErr = () => createSelector(getFormState, form => form.error);

export const isLoading = () => createSelector(getFormState, form => form.loading);