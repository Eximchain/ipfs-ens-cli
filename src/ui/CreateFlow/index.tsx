import React, { FC, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import APIClient from '@eximchain/ipfs-ens-api-client';
import { DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';
import { AppState, DeploySelectors, DeployActions } from '../../state';
import { AsyncDispatch } from '../../state/sharedTypes';

import RepoStage from './Stage1-Repo';
import BranchStage from './Stage2-Branch';
import PackageStage from './Stage3-Package';
import BuildStage from './Stage4-Build';
import ConfirmStage from './Stage5-Confirm';

export interface CreateFlowProps {
  API: APIClient
}

interface StateProps extends DeployArgs {}

interface DispatchProps {
  restart: () => void
}

const CreateFlowRouter:FC<CreateFlowProps & StateProps & DispatchProps> = (props) => {
  const { API, ensName, repo, owner, branch, packageDir, buildDir, restart } = props;

  useEffect(function clearOnStart(){
    // If the user bailed in the middle of the process,
    // this ensures their prior session doesn't pollute
    // this one
    restart();
  }, [])

  if (repo === '' || owner === '') {
    return <RepoStage />;
  }

  if (branch === '') {
    return <BranchStage />;
  }

  if (packageDir === '') {
    return <PackageStage {...{ API, repo, owner }} />
  }

  if (ensName === '' || packageDir === '' || buildDir === '') {
    return <BuildStage />;
  }

  return <ConfirmStage />;
}

const mapStateToProps = (state:AppState) => {
  return {
    ...DeploySelectors.getNewDeploy()(state)
  }
}

const mapDispatchToProps = (dispatch:AsyncDispatch) => {
  return {
    restart: () => dispatch(DeployActions.resetNewDeploy())
  }
}

export const CreateFlow = connect(mapStateToProps, mapDispatchToProps)(CreateFlowRouter);

export default CreateFlow;