import React, { PropsWithChildren, ReactElement } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { RequestProvider } from 'react-request-hook';
import { PersistGate as PersistProvider } from 'redux-persist/integration/react';
import APIClient from '@eximchain/ipfs-ens-api-client';
import axios from 'axios';
import { AdditionalArgs, ArgShape } from '../rootCommand';
import { AuthFile } from '../services';
import { ApiConf } from '@eximchain/ipfs-ens-api-client/src/types';
import makeStore from '../state';
import { Loader } from './helpers';

export type RenderFuncProps<Additional extends AdditionalArgs = AdditionalArgs> = (props: {
  API: APIClient
  auth: AuthFile
  args: ArgShape<Additional>
}) => React.ReactElement;

export type AppProps<Additional extends AdditionalArgs> = PropsWithChildren<{
  args: ArgShape<Additional>
  renderFunc: RenderFuncProps<Additional>
}>

export default CLI;

const { store, persistor } = makeStore()

export const clearStoredState = persistor.purge

/**
 * App essentially just includes the contexts for axios & redux.
 * @param props 
 */
export function CLI<Additional extends AdditionalArgs>(props: AppProps<Additional>): ReactElement {
  return (
    <RequestProvider value={axios}>
      <ReduxProvider store={store} >
        <PersistProvider persistor={persistor} 
          loading={<Loader message="Refreshing data from your computer's storage..." />}>
          <AppWithoutProviders {...props} />
        </PersistProvider>
      </ReduxProvider>
    </RequestProvider>
  )
}

function AppWithoutProviders<Additional extends AdditionalArgs>(props: AppProps<Additional>): ReactElement {
  const { args, renderFunc } = props;
  const { apiUrl } = args;
  // TODO: Load this from auth
  const auth: AuthFile = {
    token: null,
    username: null,
    userData: null
  }
  const conf: ApiConf = { apiUrl };
  if (auth.token) conf.oauthToken = auth.token;
  const API = new APIClient(conf)
  return renderFunc({ API, auth, args })
}