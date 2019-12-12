import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import APIClient from '@eximchain/ipfs-ens-api-client';

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

  const { ensName, repo, owner, branch, packageDir, buildDir } = useSelector(FormSelectors.getArgs());
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

  if (ensName === '') {
    return <NameStage {...{API}} />;
  }

  return <ConfirmStage {...{ API }} />;
}

export default CreateFlow;