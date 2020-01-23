import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import APIClient from '@eximchain/ipfs-ens-api-client';

import RepoStage from './Stage1-Repo';
import BranchStage from './Stage2-Branch';
import PackageStage from './Stage3-Package';
import BuildStage from './Stage4-Build';
import EnvStage from './Stage5-Env';
import NameStage from './Stage6-Name';
import ConfirmStage from './Stage7-Confirm';
import { FormSelectors, FormActions } from '../../state/FormDuck';

export interface CreateFlowProps {
  API: APIClient
}

export const CreateFlow:FC<CreateFlowProps> = (props) => {
  const { API } = props;

  const { ensName, repo, owner, branch, packageDir, buildDir, envVars } = useSelector(FormSelectors.getArgs());
  const [buildScript, setBuildScript] = useState('');

  if (repo === '' || owner === '') {
    return <RepoStage />;
  }

  if (branch === '') {
    return <BranchStage {...{ repo, owner }} />;
  }

  if (packageDir === '') {
    return <PackageStage {...{ API, repo, owner, branch, setBuildScript }} />
  }

  if (buildDir === '') {
    return <BuildStage {...{ buildScript, repo, owner, branch }} />;
  }

  if (envVars === undefined) {
    return <EnvStage />;
  }

  if (ensName === '') {
    return <NameStage {...{API}} />;
  }

  return <ConfirmStage {...{ API }} />;
}

export default CreateFlow;