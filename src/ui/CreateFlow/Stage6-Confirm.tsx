import React, { useState, FC, Fragment, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

import { DeployActions, DeploySelectors, FormSelectors, FormActions } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { SuccessBox } from '../helpers';

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
}

const ConfirmStage: FC<ConfirmStageProps & StateProps & DispatchProps> = (props) => {
  const { newDeploy, startDeploy, loading, error, restart } = props;

  return (
    <SuccessBox permanent operation='Ready to make the following deployment:' result={newDeploy} />
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