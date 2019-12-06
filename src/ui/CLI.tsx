import React, { PropsWithChildren, ReactElement, useEffect } from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { RequestProvider } from 'react-request-hook';
import { PersistGate as PersistProvider } from 'redux-persist/integration/react';
import APIClient from '@eximchain/ipfs-ens-api-client';
import axios from 'axios';
import { AdditionalArgs, ArgShape } from '../deployer';
import makeStore, { GitSelectors, SharedSelectors } from '../state';
import { Loader } from './helpers';

export type RenderFuncProps<Additional extends AdditionalArgs = AdditionalArgs> = (props: {
  API: APIClient
  args: ArgShape<Additional>
}) => React.ReactElement;

export type CLIProps<Additional extends AdditionalArgs> = PropsWithChildren<{
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
export function CLI<Additional extends AdditionalArgs>(props: CLIProps<Additional>): ReactElement {
  return (
    <RequestProvider value={axios}>
      <ReduxProvider store={store} >
        <PersistProvider 
          persistor={persistor} 
          loading={<Loader message="Refreshing data from your computer's storage..." />}>
          <CLIWithoutProviders {...props} />
        </PersistProvider>
      </ReduxProvider>
    </RequestProvider>
  )
}

/**
 * Putting this into a separate component means we can refer to the contexts
 * created above -- in particular, we can `useSelector` to get an API instance
 * based off the apiUrl in the Redux store.
 * 
 * @param props 
 */
function CLIWithoutProviders<Additional extends AdditionalArgs>(props: CLIProps<Additional>): ReactElement {
  const { args, renderFunc } = props;
  const API = useSelector(SharedSelectors.getApi)
  return renderFunc({ API, args })
}

