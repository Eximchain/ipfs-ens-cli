import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Color, Box } from 'ink';
import Table from 'ink-table';
import { DeploySelectors } from '../state';
import { ChevronText, Rows, ErrorBox, Loader } from './helpers';
import { DetailHeader } from './DeployDetails';

export interface DeploysTableProps {

}

export const DeploysTable: FC<DeploysTableProps> = () => {

  const deploys = useSelector(DeploySelectors.getDeploys());
  const loading = useSelector(DeploySelectors.isLoading());
  const error = useSelector(DeploySelectors.getErr());

  if (error) return (
    <ErrorBox operation={`GET /deployments`} errMsg={error.toString()} />
  )

  const deployNames = Object.keys(deploys).map(name => name.toLowerCase()).sort();
  const tableSummaries = deployNames.map((name) => {
    const deploy = deploys[name];
    const { ensName, state, repo, owner, branch } = deploy;
    return {
      Name: ensName,
      State: state,
      'Source Code': `@${owner}/${repo}#${branch}`
    }
  })

  const deployCounter = `${deployNames.length} Deploys |`;

  const header = loading ?
    <Loader noPad message={`${deployCounter} Checking server for more...`} /> :
    <ChevronText>
      {`${deployCounter} Synced with server`}
    </ChevronText>

  return (
    <Rows>
      {header}
      <Table
        header={({ children }) => (
          <Color white bgHex='#005DAD'>
            {children}
          </Color>
        )}
        data={tableSummaries} />
    </Rows>
  )

}

export default DeploysTable;