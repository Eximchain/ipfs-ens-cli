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
  const args = useSelector(FormSelectors.getArgs());

  // TODO: Make a custom handler for when this form returns,
  // automatically render the DeployDetails, that sort of thing
  const loading = useSelector(FormSelectors.isLoading());
  const error = useSelector(FormSelectors.getErr());

  // We gather paths with a plain '/' prefix, as that's the
  // shape required to query files from the GitHub API.
  // However, without the dot to make it relative, the
  // build script treat it as root, breaking everything.
  const argsWithRelativePaths = { ...args };
  argsWithRelativePaths.packageDir = '.' + args.packageDir;
  argsWithRelativePaths.buildDir = '.' + args.buildDir
  
  const req = () => API.deploys.create.resource(args.ensName, argsWithRelativePaths);
  return (
    <PrettyRequest operation={`POST /deployments/${args.ensName}`} resource={req} />
  )
}

export default ConfirmStage;