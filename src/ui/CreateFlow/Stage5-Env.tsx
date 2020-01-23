import React, { useState, FC } from 'react';
import { connect } from 'react-redux';
import { resolve } from "path"
import { config } from "dotenv"

import { DeployArgsKey, DeployArgsVal } from '@eximchain/ipfs-ens-types/spec/deployment';

import { FormActions } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { ArgPrompt, ChevronText, Select } from '../helpers';
import { Color, Text } from 'ink';

interface StateProps {

}

interface DispatchProps {
  updateNewDeploy: (field: DeployArgsKey, value: DeployArgsVal) => void
}

export interface EnvStageProps {

}

function parseEnvFile(relativePath: string) {
  let path = resolve(process.cwd(), relativePath);
  let parsedConfig = config({path: path});
  return parsedConfig.parsed;
}

const EnvStage: FC<EnvStageProps & StateProps & DispatchProps> = (props) => {
  const { updateNewDeploy } = props;
  const [envPath, setEnvPath] = useState('');
  const [needToSpecify, setNeedToSpecify] = useState(false);
  const [usingEnvFile, setUsingEnvFile] = useState(false);

  // Once we have an envPath, confirm with user and set for deployment

  if (envPath) {
    let parsedEnv = parseEnvFile(envPath) || {};
    let envVarElts = Object.entries(parsedEnv).map(([key, val]) => `${key}="${val}"`)
                                              .map(line => <Text key='env-line'>{line}</Text>);
    return (
      <Select label={[
        <ChevronText key='env-header-1'>You selected the .env file located at <Color green>{envPath}</Color></ChevronText>,
        <ChevronText key='env-header-2'>Here are the contents of the selected .env file:</ChevronText>,
        ...envVarElts,
        <ChevronText key='env-confirm'>Is this .env file correct?</ChevronText>
      ]} items={[
        { label: 'Yes, proceed to the next step', value: 'Yes' },
        { label: 'No, let me choose again', value: 'No' }
      ]} onSelect={({ value }) => {
        if (value === 'Yes') {
          updateNewDeploy('envVars', parsedEnv);
        } else {
          setUsingEnvFile(false);
          setNeedToSpecify(false);
          setEnvPath('');
        }
      }} />
    )
  }

  // Determine if we need an env at all

  if (!usingEnvFile) return (
    <Select label={[
      <ChevronText key='env-confirm'>Does your build require a .env file?</ChevronText>
    ]} items={[
      { label: 'Yes, I would like to specify a .env file for the build', value: 'Yes' },
      { label: 'No, build without a .env file', value: 'No' }
    ]} onSelect={({ value }) => {
      if (value === 'Yes') {
        setUsingEnvFile(true);
      } else {
        updateNewDeploy('envVars', {});
      }
    }} />
  )

  // Get an env path once the user says they need it

  if (!needToSpecify) return (
    <Select label={[
      <ChevronText key='env-confirm'>Is your .env file located in the current directory and named '.env'?</ChevronText>
    ]} items={[
      { label: 'Yes, my .env file is located at ./.env', value: 'Yes' },
      { label: 'No, I would like to specify a path to the .env file', value: 'No' }
    ]} onSelect={({ value }) => {
      if (value === 'Yes') {
        setEnvPath(resolve(process.cwd(), '.env'))
      } else {
        setNeedToSpecify(true)
      }
    }} />
  )

  return (
    <ArgPrompt name='Env File Path'
      label={[
        <ChevronText key='env-file-path'>Please specify a path to your .env file.  This is relative to your current directory, no need for a dot.</ChevronText>
      ]}
      withResult={(path) => {
        setEnvPath(resolve(process.cwd(), path));
      }} />
  )
}

const mapStateToProps = (state: AppState) => {
  return {

  }
}

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
  return {
    updateNewDeploy: (field: DeployArgsKey, value: DeployArgsVal) => dispatch(FormActions.update({ field, value }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EnvStage);