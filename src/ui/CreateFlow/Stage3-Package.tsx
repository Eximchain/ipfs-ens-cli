import React, { useState, FC, useEffect } from 'react';
import { connect } from 'react-redux';
import APIClient from '@eximchain/ipfs-ens-api-client';
import { GitTypes, DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

import { DeployActions, DeploySelectors } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { ArgPrompt, Loader, ErrorBox } from '../helpers';

interface StateProps {
  
}

interface DispatchProps {
  updateNewDeploy: (field:keyof DeployArgs, value:string) => void
}

export interface PackageStageProps {
  API: APIClient
  owner: string
  repo: string
}

const PackageStage: FC<PackageStageProps & StateProps & DispatchProps> = (props) => {
  const { updateNewDeploy, API, owner, repo } = props;

  const [pkgErr, setPkgErr] = useState('');
  const [pkgLoading, setPkgLoading] = useState(false);
  const [pkgContents, setPkgContents] = useState('');
  const [pkgDir, setPkgDir] = useState('');

  useEffect(function fetchSpecifiedPath() {
    const req = async () => {
      setPkgLoading(true);
      try {
        const pkgRes = await API.git.getFile(owner, repo, pkgDir);
        setPkgContents(pkgRes.content as string)
      } catch (err) {
        setPkgErr(JSON.stringify(err, null, 2));
      }
      setPkgLoading(false);
    }
    req();
  }, [pkgDir])

  // TODO: Validate the existence of package.json at specified directory

  if (pkgDir === '') {
    return (
      <ArgPrompt name='package.json-filepath' 
        label='Path to package.json'
        defaultValue='./package.json'
        withResult={(pkgVal) => setPkgDir(pkgVal)} />
    )
  }

  if (pkgContents === '' || pkgLoading) {
    return (
      <Loader message="Double-checking there's a package.json at that location..."/>
    )
  }

  if (pkgErr !== '') {
    return (
      <ErrorBox errMsg={pkgErr} />
    )
  }

  // TODO: 

  return (
    <>
      
    </>
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    
  }
}

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
  return {
    updateNewDeploy: (field:keyof DeployArgs, value:string) => dispatch(DeployActions.updateNewDeploy({ field, value }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PackageStage);