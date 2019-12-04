import React, { PropsWithChildren, ReactElement } from 'react';
import { RequestProvider } from 'react-request-hook';
import APIClient from '@eximchain/ipfs-ens-api-client';
import axios from 'axios';
import { AdditionalArgs, ArgShape } from '../cli';
import { AuthFile } from '../services';
import { ApiConf } from '@eximchain/ipfs-ens-api-client/src/types';

export type RenderFuncProps<Additional extends AdditionalArgs = AdditionalArgs> = (props: {
  API: APIClient
  auth: AuthFile
  args: ArgShape<Additional>
}) => React.ReactElement;

export type AppProps<Additional extends AdditionalArgs> = PropsWithChildren<{
  args: ArgShape<Additional>
  renderFunc: RenderFuncProps<Additional>
}>

export default App;

/**
 * App essentially just includes the <RequestProvider>, as we need it to have
 * been rendered by a parent component in order to perform API calls via 
 * the `.resource()` methods.
 * @param props 
 */
export function App<Additional extends AdditionalArgs>(props: AppProps<Additional>): ReactElement {
  return (
    <RequestProvider value={axios}>
      <AppWithoutProvider {...props} />
    </RequestProvider>
  )
}

function AppWithoutProvider<Additional extends AdditionalArgs>(props:AppProps<Additional>):ReactElement {
  const { args, renderFunc } = props;
  const { apiUrl } = args;
  // TODO: Load this from auth
  const auth:AuthFile = {
    token: null,
    username: null,
    userData: null
  }
  const conf:ApiConf = { apiUrl };
  if (auth.token) conf.oauthToken = auth.token;
  const API = new APIClient(conf)
  return renderFunc({ API, auth, args })
}