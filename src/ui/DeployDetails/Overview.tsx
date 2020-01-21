import React, { FC } from 'react';
import { Color } from 'ink';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import { DeployStates, DeployItem } from "@eximchain/ipfs-ens-types/spec/deployment";
import { Rows, Column, ChevronText, Row } from '../helpers';
import { DetailHeader } from '../DeployDetails';
import { timeStr } from './Progress';


export const Overview: FC<DeployItem> = (props) => {
  const { ensName, owner, repo, createdAt, state, branch, transitionError, transitions } = props;
  const createMoment = moment(createdAt);
  const now = moment();

  let stateMsg = transitionError ? `Error: ${state}` : state;
  // Dark Yellow / Gold
  let statusColor = '#837600';
  if (state === DeployStates.AVAILABLE) statusColor = '#26D11E';
  if (transitionError) statusColor = '#8C1515'

  const OverviewRows = [
    <DetailHeader key='header'>{ensName}</DetailHeader>,
    <ChevronText key='create-time'>
      {'Created '}
      {createMoment.from(now)}{' on '}
      {createMoment.format('MMM Mo')}{' at '}
      {createMoment.format('h:mmA')}
    </ChevronText>,
    <ChevronText key='source'>
      {`Sourced from @${owner}/${repo}'s ${branch} branch`}
    </ChevronText>
  ];

  if (transitionError) OverviewRows.push(
    <ChevronText key='error'>
      {`Deployment failed during the ${state} stage`}
    </ChevronText>
  )
  if (transitions.source) OverviewRows.push(
    <ChevronText key='source-size'>
      {`Source code size was ${prettyBytes(transitions.source.size)}`}
    </ChevronText>
  )
  if (transitions.build) OverviewRows.push(
    <ChevronText key='build-size'>
      {`Build size was ${prettyBytes(transitions.build.size)}`}
    </ChevronText>
  )
  if (transitions.ipfs) OverviewRows.push(
    <ChevronText key='ipfs-hash'>
      {`IPFS Upload hash was ${transitions.ipfs.hash}`}
    </ChevronText>
  )
  if (transitions.ensRegister) OverviewRows.push(
    <ChevronText key=''>
      {`Registered your subdomain with transaction ${transitions.ensRegister.txHash}`}
    </ChevronText>
  )
  if (transitions.ensSetResolver) OverviewRows.push(
    <ChevronText key=''>
      {`Added a resolver with transaction ${transitions.ensSetContent?.txHash}`}
    </ChevronText>
  )
  if (transitions.ensSetContent) OverviewRows.push(
    <ChevronText key='complete'>
      {`Deployment completed ${timeStr(createdAt, transitions.ensSetContent.timestamp)}, final transaction hash was ${transitions.ensSetContent.txHash}`}
    </ChevronText>
  )
  return (
    <Row noSideMargin noLinePad justifyContent='space-between'>
      <Rows noLinePad noSideMargin>
        { OverviewRows }
      </Rows>
      <Column>
        <DetailHeader bgHex={statusColor}>{stateMsg}</DetailHeader>
      </Column>
    </Row>
  )
}

export default Overview;