import React, { FC, useState, useEffect } from 'react';
import APIClient from '@eximchain/ipfs-ens-api-client';
import { ArgPrompt } from '..';
import { useDispatch } from 'react-redux';
import { FormActions } from '../../state';
import { ChevronText, Loader, ErrorBox, ConfirmAction } from '../helpers';
import { useResource } from 'react-request-hook';

export interface NameStageProps {
  API: APIClient
}

export const NameStage: FC<NameStageProps> = ({ API }) => {

  const dispatch = useDispatch();
  const [maybeName, setMaybeName] = useState('');
  const [nameRes, checkName] = useResource(API.deploys.read.resource);
  const { data, isLoading, error } = nameRes;

  useEffect(function checkNameOnSet() {
    if (maybeName === '') return;
    checkName(maybeName);
  }, [maybeName])


  if (isLoading) {
    return <Loader message={`Checking to see if ${maybeName} is available...`} />
  };

  if (error) {
    return <ErrorBox errMsg={`Failed to check if ${maybeName} is available: ${error.toString()}`} />
  }

  const nameAvailable = maybeName && data && data.data && !data.data.exists;
  if (nameAvailable) return (
    <ConfirmAction
      action={`${maybeName} is available!`}
      confirmMsg={`Use ${maybeName} and continue`}
      denyMsg={`Check a different name`}
      confirm={() => dispatch(FormActions.update({
        field: 'ensName',
        value: maybeName
      }))}
      deny={() => setMaybeName('')}
    />
  )

  return (
    <ArgPrompt name='Subdomain'
      label={[
        <ChevronText key='what-subdomain'>
          {
            maybeName && data && data.data && data.data.exists ?
              `Unfortunately, ${maybeName} is taken. Which ENS subdomain would you like instead?` :
              'What ENS subdomain would you like?'
          }
        </ChevronText>,
        <ChevronText key='like-something'>
          This is the [something] in [something].hosted.eth.
        </ChevronText>
      ]}
      withResult={setMaybeName} />
  )
}

export default NameStage;