import React, { FC } from 'react';
import { ArgPrompt } from '..';
import { useDispatch } from 'react-redux';
import { FormActions } from '../../state';
import { ChevronText } from '../helpers';

export interface NameStageProps {

}

export const NameStage: FC<NameStageProps> = (props) => {

  const dispatch = useDispatch();

  // TODO: Validate the availability of the desired ENS name

  return (
    <ArgPrompt name='Subdomain' 
      label={[
        <ChevronText key='what-subdomain'>
          What ENS subdomain would you like?
        </ChevronText>,
        <ChevronText key='like-something'>
          This is the [something] in [something].hosted.eth.
        </ChevronText>
      ]}
      withResult={(newName) => {
        dispatch(FormActions.updateNewDeploy({ 
          field: 'ensName', 
          value: newName 
        }))
      }} />
  )
}

export default NameStage;