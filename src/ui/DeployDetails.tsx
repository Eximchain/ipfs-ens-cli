import React, { FC, ReactNode, ReactText } from 'react';
import { Box, Color, Text, ColorProps, TextProps, BoxProps } from 'ink';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { DeploySelectors, GitSelectors } from '../state';
import { Rows, Row, Column, Loader, ChevronText, ErrorBox } from './helpers';
import { DeployStates, DeployItem } from '@eximchain/ipfs-ens-types/spec/deployment';


// @ts-ignore This undocumented option makes it shut up about our
// ill-formatted datestrings while I'm still in development.
moment.suppressDeprecationWarnings = true;

export interface DeployDetailsProps {
  ensName: string
}

function isReactText(val: any): val is ReactText {
  const valType = typeof val;
  return valType === 'string' || valType === 'number';
}

export const DetailHeader: FC<ColorProps & TextProps & BoxProps> = ({ children, ...props }) => {
  let bgHex = props.bgHex || "#005DAD";
  return (
    <Color {...props} bgHex={bgHex}>
      <Box {...props}>
        <Text {...props}>
          {' '}
          {
            React.Children.map(children, (child, i) => {
              if (isReactText(child)) {
                return child.toString().toUpperCase();
              } else return child;
            })
          }
          {' '}
        </Text>
      </Box>
    </Color>
  )
}

function statusColor(status: DeployStates): string {
  switch (status) {
    case DeployStates.AVAILABLE:
      // Green
      return '#26D11E';
    default:
      // Dark Yellow/Gold
      return '#837600'
  }
}

const DetailRow: FC<DeployItem> = (props) => {
  const { ensName, owner, repo, createdAt, state, branch } = props;
  const createMoment = moment(createdAt);
  const now = moment();
  return (
    <Row noSideMargin noLinePad justifyContent='space-between'>
      <Rows noLinePad noSideMargin>
        <DetailHeader>{ensName}</DetailHeader>
        <ChevronText>
          {'Created '}
          {createMoment.from(now)}{' on '}
          {createMoment.format('MMM Mo')}{' at '}
          {createMoment.format('h:mmA')}
        </ChevronText>
        <ChevronText>
          {`Sourced from @${owner}/${repo}'s ${branch} branch`}
        </ChevronText>
      </Rows>
      <Column>
        <DetailHeader bgHex={statusColor(state)}>{state}</DetailHeader>
      </Column>
    </Row>
  )
}

const ScriptRow: FC<{
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

function humanDiff(timeA: moment.Moment, timeB: moment.Moment): string {
  return moment.duration(timeA.diff(timeB)).humanize();
}

function progressStr(action: string, start?: string, end?: string) {
  if (!start && !end) return `PENDING: ${action}`
  const now = moment();
  return end ?
    `COMPLETE: ${action} in ${humanDiff(moment(start), moment(end))}` :
    `IN PROGRESS: Started ${action.toLowerCase()} ${moment(start).from(now)}`
}

const ProgressRow: FC<{
  transitions: DeployItem['transitions']
  state: DeployItem['state']
  createdAt: string
  loading: boolean
}> = ({ transitions, state, createdAt, loading }) => {

  let sourceMsg = progressStr('Fetching your source code', createdAt)
  let buildMsg = progressStr('Building your source code')
  let ipfsMsg = progressStr('Sending your build to IPFS');
  let registerMsg = progressStr('Registering your subdomain');
  let resolverMsg = progressStr("Setting your subdomain's resolver address");
  let contentMsg = progressStr("Adding your IPFS hash to the resolver");

  if (transitions.source) {
    // Completed source, set that and build
    let sourceTimestamp = transitions.source.timestamp;
    sourceMsg = progressStr('Fetched your source code', createdAt, sourceTimestamp);
    buildMsg = progressStr('Building your source code', sourceTimestamp)
  }

  if (transitions.source && transitions.build) {
    // Completed build, set that and IPFS
    let sourceTimestamp = transitions.source.timestamp;
    let buildTimestamp = transitions.build.timestamp;
    buildMsg = progressStr('Built your source code', sourceTimestamp, buildTimestamp);
    ipfsMsg = progressStr('Sending your build to IPFS', buildTimestamp);
  }

  if (transitions.build && transitions.ipfs) {
    // Completed IPFS, set that and register
    let buildTimestamp = transitions.build.timestamp;
    let ipfsTimestamp = transitions.ipfs.timestamp;
    ipfsMsg = progressStr('Sent your build to IPFS', buildTimestamp, ipfsTimestamp);
    registerMsg = progressStr('Registering your subdomain', ipfsTimestamp);
  }

  if (transitions.ipfs && transitions.ensRegister) {
    // Completed register, set that and resolver
    let ipfsTimestamp = transitions.ipfs.timestamp;
    let registerTimestamp = transitions.ensRegister.timestamp;
    registerMsg = progressStr('Registered your subdomain', ipfsTimestamp, registerTimestamp);
    resolverMsg = progressStr("Setting your subdomain's resolver address", registerTimestamp);
  }

  if (transitions.ensRegister && transitions.ensSetResolver) {
    // Completed resolver, set that and content
    let registerTimestamp = transitions.ensRegister.timestamp;
    let resolverTimestamp = transitions.ensSetResolver.timestamp;
    resolverMsg = progressStr("Set your subdomain's resolver address", registerTimestamp, resolverMsg);
    contentMsg = progressStr("Adding your IPFS hash to the resolver", resolverTimestamp)
  }

  if (transitions.ensSetResolver && transitions.ensSetContent) {
    // Completed everything incl content
    let resolverTimestamp = transitions.ensSetResolver.timestamp;
    let contentTimestamp = transitions.ensSetContent.timestamp;
    contentMsg = progressStr("Added your IPFS hash to the resolver", resolverTimestamp, contentTimestamp)
  }

  const transitionMessages = [
    sourceMsg,
    buildMsg,
    ipfsMsg,
    registerMsg,
    resolverMsg,
    contentMsg
  ]
  return (
    <Rows noLinePad noSideMargin>
      <Row noSideMargin noLinePad>
        <DetailHeader>Deployment Progress</DetailHeader>
        { loading ? (
          <Loader noPad message='Checking for updates on server...' />
        ) : null}
      </Row>
      {
        transitionMessages.map((msg, i) => (
          <Text key={i}>{`${i + 1}. ${msg}`}</Text>
        ))
      }
    </Rows>
  )
}

const ErrorRow: FC<{ error: any }> = ({ error }) => {
  return error ? (
    <ErrorBox errMsg={error.toString()} />
  ) : null;
}

export const DeployDetails: FC<DeployDetailsProps> = ({ ensName }) => {
  const deploy = useSelector(DeploySelectors.getDeploy(ensName))
  const loading = useSelector(DeploySelectors.isLoading());
  const error = useSelector(DeploySelectors.getErr());

  // If we don't even have something in memory, just return the
  // loader alone.  Generally, we ought to be able to show em
  // the stored data instantly before completing the fetch to
  // see if anything has changed.
  if (!deploy) return <Loader message={"Fetching your deploy state, one moment..."} />

  const {
    transitions, createdAt, state, packageDir, buildDir,
    owner, repo, branch
  } = deploy;


  let itemRows = [
    <DetailRow {...deploy} key='details' />
  ];

  // Only include the ErrorRow if the error is present; if
  // the component returns null, it will still get padding
  // breaking the overall flow
  if (error) itemRows.push(
    <ErrorRow error={error} key='error' />
  );

  itemRows.push(
    <ProgressRow {...{ state, transitions, createdAt, loading }} key='progress' />,
    <ScriptRow {...{ packageDir, buildDir, owner, repo, branch }} key='build-script' />
  )
  return (
    <Rows textWrap='wrap'>
      { ...itemRows }
    </Rows>
  )
}

export default DeployDetails;