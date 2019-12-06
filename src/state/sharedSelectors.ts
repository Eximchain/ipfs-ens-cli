import { createSelector } from 'reselect';
import APIClient from '@eximchain/ipfs-ens-api-client';
import { getApiUrl } from './DeployDuck/selectors';
import { getToken } from './GitDuck/selectors';

export const getApi = createSelector(getToken, getApiUrl, (oauthToken, apiUrl) => new APIClient({
  oauthToken, apiUrl
}))