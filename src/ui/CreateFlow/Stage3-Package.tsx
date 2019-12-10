import React, { useState, FC, useEffect } from 'react';
import { Text } from 'ink';
import { connect } from 'react-redux';
import APIClient from '@eximchain/ipfs-ens-api-client';
import { GitTypes, DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

import { DeployActions, DeploySelectors, FormActions } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { ArgPrompt, Loader, ErrorBox, SuccessBox } from '../helpers';

interface StateProps {
  
}

interface DispatchProps {
  updateNewDeploy: (field:keyof DeployArgs, value:string) => void
}

export interface PackageStageProps {
  API: APIClient
  owner: string
  repo: string
  branch: string
  setBuildScript: (script:string) => void
}

const PackageStage: FC<PackageStageProps & StateProps & DispatchProps> = (props) => {
  const { updateNewDeploy, API, owner, repo, branch, setBuildScript } = props;

  const [pkgErr, setPkgErr] = useState('');
  const [pkgLoading, setPkgLoading] = useState(false);
  const [pkgContents, setPkgContents] = useState('');
  const [pkgDir, setPkgDir] = useState('/');

  useEffect(function fetchFileFromDir() {
    const req = async () => {
      if (pkgDir === '') return;
      setPkgLoading(true);
      try {
        const pkgRes = await API.git.getFile(owner, repo, `${pkgDir}package.json`, branch);
        setPkgContents(pkgRes);
      } catch (err) {
        setPkgErr(`We tried to find your package.json at ${pkgDir}package.json, but nothing was there.`);
      }
      setPkgLoading(false);
    }
    req();
  }, [pkgDir])

  useEffect(function checkFoundFile(){
    if (pkgContents === '') return;
    try {
      const pkgJson = JSON.parse(pkgContents);
      if (typeof pkgJson !== "object") {
        setPkgErr('The file we found was not a valid package.json.')
        return;
      };
      if (!pkgJson.scripts || !pkgJson.scripts.build) {
        setPkgErr('The package.json file we found did not have a build script.');
        return;
      } else {
        setBuildScript(pkgJson.scripts.build);
      }

      // This ought to navigate us out of this stage
      updateNewDeploy('packageDir', pkgDir);
    } catch (err) {
      setPkgErr(err.toString());
    }
    
  }, [pkgContents])

  if (pkgLoading) {
    return (
      <Loader message={`Looking for a package.json at ${pkgDir === '/' ? 'repo root' : pkgDir}...`} />
    )
  }

  if (pkgErr !== '') {
    // TODO: Would you like to:
    // 1. Specify a new directory to look for package.json
    // 2. Pick a different branch
    // 3. Pick a different repo
    //
    // If new directory, zero out pkgDir
    return (
      <ErrorBox errMsg={pkgErr} />
    )
  }

  if (pkgErr === '' && pkgContents !== '') {

  }
  return (
    <ArgPrompt name='package.json-filepath' 
      label='Path to package.json (include leading & trailing slash)'
      defaultValue='package.json'
      withResult={(pkgVal) => setPkgDir(pkgVal)} />
  )

}

const mapStateToProps = (state: AppState) => {
  return {
    
  }
}

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
  return {
    updateNewDeploy: (field:keyof DeployArgs, value:string) => dispatch(FormActions.updateNewDeploy({ field, value }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PackageStage);