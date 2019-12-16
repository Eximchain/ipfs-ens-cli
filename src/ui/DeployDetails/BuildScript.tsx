import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Text } from 'ink';
import { GitSelectors } from '../../state';
import { Rows } from '../helpers';
import { DetailHeader } from './index';

export const BuildScript: FC<{
  packageDir: string
  buildDir: string
  owner: string
  repo: string
  branch: string
}> = (props) => {
  const { packageDir, buildDir, owner, repo, branch } = props;
  const repos = useSelector(GitSelectors.getRepos());
  const repoData = repos.find(eachRepo => eachRepo.owner.login === owner && eachRepo.name === repo)
  let gitUrl;
  if (!repoData) {
    gitUrl = 'someurl'
  } else {
    gitUrl = repoData.git_url
  }
  return (
    <Rows noSideMargin noLinePad>
      <DetailHeader>Build Script</DetailHeader>
      <Text>$ git clone {gitUrl}</Text>
      <Text>$ cd {repo}</Text>
      <Text>$ git fetch</Text>
      <Text>$ git checkout {branch}</Text>
      <Text>$ cd {packageDir}</Text>
      <Text>$ npm build</Text>
      <Text>$ cd {buildDir}</Text>
      <Text>$ zip -r ../your-static-build.zip *</Text>
    </Rows>
  )
}

export default BuildScript;