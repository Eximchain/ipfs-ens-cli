import React, { useState, FC } from 'react';
import { connect } from 'react-redux';
import APIClient from '@eximchain/ipfs-ens-api-client';
import { DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

import { FormSelectors, FormActions } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { SuccessBox, PrettyRequest } from '../helpers';
import { useResource } from 'react-request-hook';

interface StateProps {
  newDeploy: DeployArgs
  loading: boolean
  error: any
}

interface DispatchProps {
  startDeploy: (args:DeployArgs) => void
}

export interface ConfirmStageProps {
  restart: () => void
  API: APIClient
}

const ConfirmStage: FC<ConfirmStageProps & StateProps & DispatchProps> = (props) => {
  const { newDeploy, API } = props;

  const req = () => API.deploys.create.resource(newDeploy.ensName, newDeploy);
  return (
    <PrettyRequest operation={`POST /deployments/${newDeploy.ensName}`} resource={req} />
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    newDeploy : FormSelectors.getNewDeploy()(state),
    loading: FormSelectors.isLoading()(state),
    error: FormSelectors.getErr()(state)
  }
}

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
  return {
    startDeploy: (args:DeployArgs) => {
      console.log('Trigger to createDeployment actions w/ following args: ',args);
      dispatch(FormActions.createDeploy(args));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmStage);