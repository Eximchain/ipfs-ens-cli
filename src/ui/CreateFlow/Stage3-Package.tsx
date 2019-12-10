import React, { useState, FC, useEffect } from 'react';
import { Text } from 'ink';
import { connect, useDispatch } from 'react-redux';
import APIClient from '@eximchain/ipfs-ens-api-client';
import { GitTypes, DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

import { DeployActions, DeploySelectors, FormActions } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { ArgPrompt, Loader, ErrorBox, SuccessBox, Select, ChevronText, ErrorLabel } from '../helpers';

export interface PackageStageProps {
  API: APIClient
  owner: string
  repo: string
  branch: string
  setBuildScript: (script:string) => void
}

export const PackageStage: FC<PackageStageProps> = (props) => {
  const { API, owner, repo, branch, setBuildScript } = props;

  const [pkgErr, setPkgErr] = useState('');
  const [pkgLoading, setPkgLoading] = useState(false);
  const [pkgContents, setPkgContents] = useState('');
  const [pkgDir, setPkgDir] = useState('/');

  const dispatch = useDispatch();

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
      dispatch(FormActions.updateNewDeploy({
        field: 'packageDir',
        value: pkgDir
      }))
    } catch (err) {
      setPkgErr(err.toString());
    }
    
  }, [pkgContents, pkgDir])

  if (pkgLoading) {
    return (
      <Loader message={`Looking for a package.json at ${pkgDir === '/' ? 'repo root' : pkgDir}...`} />
    )
  }

  if (pkgErr !== '') {
    return (
      <Select label={[
        <Text key='error-val'><ErrorLabel />{' '}{pkgErr}</Text>,
        <ChevronText key='next-step'>What would you like to do?</ChevronText>
      ]} items={[
        { value: 'pickDir', label: 'Specify the directory of a valid package.json' },
        { value: 'newBranch', label: 'Pick a different branch'},
        { value: 'newRepo', label: 'Pick a different repository' }
      ]} onSelect={({ value }) => {
        switch(value){
          case 'pickDir':
            setPkgDir('');
            setPkgErr('');
            setPkgContents('');
            break;
          case 'newBranch':
            dispatch(FormActions.updateNewDeploy({
              field: 'branch',
              value: ''
            }))
            break;
          case 'newRepo':
            dispatch(FormActions.updateMultiple([
              ['branch', ''],
              ['repo', '']
            ]))
            break;
        }
      }} />
    )
  }

  return (
    <ArgPrompt name='Directory' 
      label='Where can we find your package.json? Please include leading & trailing slash.'
      defaultValue='/'
      withResult={(pkgVal) => setPkgDir(pkgVal)} />
  )

}

export default PackageStage;