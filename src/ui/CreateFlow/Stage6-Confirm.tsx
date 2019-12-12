import React, { useState, FC } from 'react';
import { connect, useSelector } from 'react-redux';
import APIClient from '@eximchain/ipfs-ens-api-client';
import { DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

import { FormSelectors, FormActions } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { SuccessBox, PrettyRequest } from '../helpers';
import { useResource } from 'react-request-hook';

export interface ConfirmStageProps {
  API: APIClient
}

export const ConfirmStage: FC<ConfirmStageProps> = (props) => {
  const { API } = props;
  const newDeploy = useSelector(FormSelectors.getArgs());
  const loading = useSelector(FormSelectors.isLoading());
  const error = useSelector(FormSelectors.getErr());
  const req = () => API.deploys.create.resource(newDeploy.ensName, newDeploy);
  return (
    <PrettyRequest operation={`POST /deployments/${newDeploy.ensName}`} resource={req} />
  )
}

export default ConfirmStage;