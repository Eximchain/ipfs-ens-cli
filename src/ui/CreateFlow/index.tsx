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
import NameStage from './Stage5-Name';
import ConfirmStage from './Stage6-Confirm';
import { FormSelectors, FormActions } from '../../state/FormDuck';

export interface CreateFlowProps {
  API: APIClient
}

interface StateProps extends DeployArgs {}

interface DispatchProps {
  restart: () => void
}

const CreateFlowRouter:FC<CreateFlowProps & StateProps & DispatchProps> = (props) => {
  const { API, ensName, repo, owner, branch, packageDir, buildDir, restart } = props;
  const [buildScript, setBuildScript] = useState('');

  useEffect(function clearOnFinish(){
    // If the user bailed in the middle of the process,
    // this ensures their prior session doesn't pollute
    // this one
    return () => restart();
  }, [restart])

  if (repo === '' || owner === '') {
    return <RepoStage />;
  }

  if (branch === '') {
    return <BranchStage />;
  }

  if (packageDir === '') {
    // @ts-ignore
    return <PackageStage {...{ API, repo, owner, branch, setBuildScript }} />
  }

  if (buildDir === '') {
    return <BuildStage {...{ buildScript }} />;
  }

  if (ensName === '') {
    return <NameStage />;
  }

  return <ConfirmStage {...{ restart }} />;
}

const mapStateToProps = (state:AppState) => {
  return {
    ...FormSelectors.getNewDeploy()(state)
  }
}

const mapDispatchToProps = (dispatch:AsyncDispatch) => {
  return {
    restart: () => dispatch(FormActions.resetNewDeploy())
  }
}

export const CreateFlow = connect(mapStateToProps, mapDispatchToProps)(CreateFlowRouter);

export default CreateFlow;