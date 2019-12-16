import React, { FC , ReactText } from 'react';
import { Color, ColorProps, BoxProps, Box, TextProps, Text } from 'ink';
import ScriptRow from './BuildScript';
import DetailRow from './Overview';
import ProgressRow from './Progress';
import { ErrorBox, Loader, Rows } from '..';
import { useSelector } from 'react-redux';
import { DeploySelectors } from '../../state';

function isReactText(val: any): val is ReactText {
  const valType = typeof val;
  return valType === 'string' || valType === 'number';
}

const ErrorRow: FC<{ error: any }> = ({ error }) => {
  return error ? (
    <ErrorBox errMsg={error.toString()} />
  ) : null;
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

export interface DeployDetailsProps {
  ensName: string
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
    owner, repo, branch, transitionError
  } = deploy;


  let itemRows = [
    <DetailRow {...deploy} key='details' />
  ];

  // Only include the ErrorRow if the error is present; if
  // the component returns null, it will still get padding
  // breaking the overall flow
  // let anyError = error || transitionError;
  // if (anyError) itemRows.push(
  //   <ErrorRow error={JSON.stringify(anyError, null, 2)} key='error' />
  // );

  // itemRows.push(
  //   <ProgressRow {...{ state, transitions, createdAt, loading, transitionError }} key='progress' />,
  //   <ScriptRow {...{ packageDir, buildDir, owner, repo, branch }} key='build-script' />
  // )
  return (
    <Rows textWrap='wrap'>
      <DetailRow {...deploy} key='details' />
      <ProgressRow {...{ state, transitions, createdAt, loading, transitionError }} key='progress' />
      <ScriptRow {...{ packageDir, buildDir, owner, repo, branch }} key='build-script' />
    </Rows>
  )
}

export default DeployDetails;