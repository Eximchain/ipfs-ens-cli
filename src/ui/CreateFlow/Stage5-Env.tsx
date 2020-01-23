import React, { useState, FC } from 'react';
import { connect } from 'react-redux';
import { resolve } from "path"
import { config } from "dotenv"

import { DeployArgsKey, DeployArgsVal } from '@eximchain/ipfs-ens-types/spec/deployment';

import { FormActions } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { ArgPrompt, ConfirmAction, Rows, ChevronText, Select } from '../helpers';
import { Color } from 'ink';

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

  if (envPath) {
    let parsedEnv = parseEnvFile(envPath);
    // TODO: confirm vars with user
    updateNewDeploy('envVars', parsedEnv);
  }

  if (!usingEnvFile) return (
    <Select label={[
      <ChevronText key='confirm-env'>Does your build require a .env file?</ChevronText>
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

  if (!needToSpecify) return (
    <Select label={[
      <ChevronText key='confirm-env'>Is your .env file located in the current directory and named '.env'?</ChevronText>
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
    <ArgPrompt name='Env File Path:'
      label={[
        <ChevronText key='env-file-path'>Please specify a path to your .env file.  This is relative to your current directory, no need for a dot.</ChevronText>
      ]}
      withResult={(path) => {
        setEnvPath(path);
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