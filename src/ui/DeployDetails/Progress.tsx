import React, { FC } from 'react';
import moment from 'moment';
import { Text } from 'ink';
import { DeployItem, Transitions, DeployStates } from '@eximchain/ipfs-ens-types/spec/deployment';
import { Rows, Loader, Row } from '../helpers';
import { DetailHeader } from './index';
import { StateNum, StateToTransition } from '../../state/DeploysDuck/types';

export function timeStr(start: string, end?: string) {
  const timeA = moment(start);
  const timeB = end ? moment(end) : null;
  const now = moment();

  function humanDiff(timeA: moment.Moment, timeB: moment.Moment): string {
    return moment.duration(timeA.diff(timeB)).humanize();
  }

  return timeB ?
    `in ${humanDiff(timeA, timeB)}` :
    `${humanDiff(timeA, now)} ago`
}

function transitionTime(enterTransition?:Transitions.Any | string, leaveTransition?:Transitions.Any):string {
  if (!enterTransition) return '';
  let enterTimestamp = typeof enterTransition === 'string' ? enterTransition : enterTransition.timestamp;
  return leaveTransition ? 
        timeStr(enterTimestamp, leaveTransition.timestamp) :
        timeStr(enterTimestamp);
}

function getTense(currentState:DeployStates, thisState:DeployStates):'past'|'present'|'future' {
  if (currentState === thisState) return 'present';
  return StateNum[currentState] > StateNum[thisState] ? 'past' : 'future';
}

const ProgressItem: FC<{
  currentState: DeployItem['state']
  thisState: DeployItem['state']
  transitions: DeployItem['transitions']
  transitionError: DeployItem['transitionError']
  createdAt: string
  start?: string
  end?: string
}> = (props) => {
  const { 
    currentState, thisState, transitionError, start, end, createdAt,
    transitions
   } = props;
  let msg;
  let tense = getTense(currentState, thisState)

  function conjugate(verb:string) {
    switch (tense) {
      case 'past':
        if (verb.toLowerCase() === 'build') return 'Built';
        if (verb.toLowerCase() === 'set') return 'Set';
        return verb + 'ed';
      case 'present':
        return verb + 'ing';
      case 'future':
        return verb;
    }
  }

  switch (thisState) {
    case DeployStates.FETCHING_SOURCE:
      msg = `${conjugate('Fetch')} your repository ${transitionTime(
        createdAt, transitions.source
      )}`
      break;
    case DeployStates.BUILDING_SOURCE:
      msg = `${conjugate('Build')} your source code ${transitionTime(
        transitions.source, transitions.build
      )}`
      break;
    case DeployStates.DEPLOYING_IPFS:
      msg = `${conjugate('Send')} your build to IPFS ${transitionTime(
        transitions.build,
        transitions.ipfs
      )}`
      break;
    case DeployStates.REGISTERING_ENS:
      // Register, Registering, Registered
      msg = `${conjugate('Register')} your subdomain ${transitionTime(
        transitions.ipfs, transitions.ensRegister
      )}`
      break;
    case DeployStates.SETTING_RESOLVER_ENS:
      // Set, Setting, Set
      msg = `${conjugate('Set')} your subdomain's resolver address ${transitionTime(
        transitions.ensRegister, transitions.ensSetContent
      )}`
      break;
    case DeployStates.SETTING_CONTENT_ENS:
      msg = `${conjugate('Add')} your IPFS hash to the resolver ${transitionTime(
        transitions.ensSetResolver, transitions.ensSetContent
      )}`;
      break;
    default:
      // Available or propagating
  }
  if (transitionError && transitionError.transition === StateToTransition[thisState]){
    msg = transitionError.message;
  }
  switch (tense) {
    case 'past':
      msg = 'COMPLETE: ' + msg;
      break;
    case 'present':
      if (transitionError) {
        msg = "ERROR: " + msg;
      } else {
        msg = "IN PROGRESS: " + msg;
      }
      break;
    case 'future':
        if (transitionError) {
          msg = "CANCELLED: " + msg;
        } else {
          msg = "PENDING: " + msg;
        }
        break;
  }
  
  msg = `${StateNum[thisState]}: ` + msg;
  return <Text>{msg}</Text>;
}

const ProgressRow: FC<{
  transitions: DeployItem['transitions']
  transitionError: DeployItem['transitionError']
  state: DeployItem['state']
  createdAt: string
  loading: boolean
}> = ({ transitions, transitionError, state, createdAt, loading }) => {
  let sharedProps = { transitions, transitionError, createdAt, currentState: state }
  return (
    <Rows noLinePad noSideMargin textWrap='wrap'>
      <Row noSideMargin noLinePad>
        <DetailHeader>Deployment History</DetailHeader>
        { loading ? (
          <Loader noPad message='Checking for updates on server...' />
        ) : null}
      </Row>
      <ProgressItem thisState={DeployStates.FETCHING_SOURCE} {...sharedProps} />
      <ProgressItem thisState={DeployStates.BUILDING_SOURCE} {...sharedProps} />
      <ProgressItem thisState={DeployStates.DEPLOYING_IPFS} {...sharedProps} />
      <ProgressItem thisState={DeployStates.REGISTERING_ENS} {...sharedProps} />
      <ProgressItem thisState={DeployStates.SETTING_RESOLVER_ENS} {...sharedProps} />
      <ProgressItem thisState={DeployStates.SETTING_CONTENT_ENS} {...sharedProps} />
    </Rows>
  )
}

export default ProgressRow;