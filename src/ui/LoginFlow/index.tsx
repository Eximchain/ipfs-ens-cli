import React, { FC, useState, useEffect } from 'react';
import APIClient from '@eximchain/ipfs-ens-api-client';

import ConfirmURL from './ConfirmURL';
import SaveUser from './SaveUser';
import { ArgPrompt } from '../helpers';
import { useDispatch } from 'react-redux';
import { GitActions } from '../../state';

export interface LoginFlowProps {
  API: APIClient
}

export const LoginFlow:FC<LoginFlowProps> = ({ API }) => {
  const dispatch = useDispatch();
  const [retrievedCode, setRetrievedCode] = useState(false);
  const [code, setCode] = useState('');

  useEffect(function resetAuthOnStart(){
    dispatch(GitActions.resetAuth())
  }, [dispatch]);

  if (!retrievedCode) {
    return <ConfirmURL {...{ API, setRetrievedCode }} />
  }

  if (code === '') {
    return (
      <ArgPrompt 
        label='Please enter the code you copied from our login page.'
        withResult={setCode}
        name='One-Time Code' />
    )
  }

  return <SaveUser {...{ API, code }} />
}