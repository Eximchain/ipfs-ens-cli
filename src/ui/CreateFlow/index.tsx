import React, { FC, useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
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

export const CreateFlow:FC<CreateFlowProps> = (props) => {
  const { API } = props;

  const newDeploy = useSelector(FormSelectors.getNewDeploy());
  const { ensName, repo, owner, branch, packageDir, buildDir } = newDeploy;
  const [buildScript, setBuildScript] = useState('');

  const dispatch = useDispatch();
  function restart(){
    dispatch(FormActions.resetNewDeploy())
  }

  if (repo === '' || owner === '') {
    return <RepoStage />;
  }

  if (branch === '') {
    return <BranchStage />;
  }

  if (packageDir === '') {
    
    return <PackageStage {...{ API, repo, owner, branch, setBuildScript }} />
  }

  if (buildDir === '') {
    return <BuildStage {...{ buildScript, repo, owner, branch }} />;
  }

  if (ensName === '') {
    return <NameStage />;
  }

  return <ConfirmStage {...{ API, restart }} />;
}

export default CreateFlow;