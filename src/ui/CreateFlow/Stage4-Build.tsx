import React, { useState, FC } from 'react';
import { connect } from 'react-redux';
import { Text } from 'ink';
import { DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

import { FormActions } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { ArgPrompt, ConfirmAction, Rows, ChevronText, Select } from '../helpers';
import { Color } from 'ink';

interface StateProps {

}

interface DispatchProps {
  updateNewDeploy: (field: keyof DeployArgs, value: string) => void
}

export interface BuildStageProps {
  buildScript: string
  repo: string
  owner: string
  branch: string
}

const BuildStage: FC<BuildStageProps & StateProps & DispatchProps> = (props) => {
  const { updateNewDeploy, buildScript, repo, owner, branch } = props;
  const [needToSpecify, setNeedToSpecify] = useState(false);

  const buildScriptElts = [
    <ChevronText key='build-script-location'>
      Build Script found in <Text bold>@{owner}/{repo}</Text> on <Text bold>{branch}</Text>: 
    </ChevronText>,
    <ChevronText key='build-script-value'>
      <Color green>{buildScript}</Color>
    </ChevronText>
  ]

  if (!needToSpecify && buildScript === 'react-scripts build') return (
    <Select label={[
      ...buildScriptElts,
      <ChevronText key='confirm-cra'>Does your project compile to "/build"?  It looks like you're using create-react-app.</ChevronText>
    ]} items={[
      { label: 'Yes, /build is my build directory', value: 'Yes' },
      { label: 'No, pick a different one', value: 'No' }
    ]} onSelect={({ value }) => {
      if (value === 'Yes') {
        updateNewDeploy('buildDir', '/build')
      } else {
        setNeedToSpecify(true)
      }
    }} />
  )

  return (
    <ArgPrompt name='Directory:'
      label={[
        ...buildScriptElts,
        <ChevronText key='custom-build-dir'>What directory will your build end up in?  This is relative to your repository root, no need for a dot.</ChevronText>
      ]}
      withResult={(newName) => {
        updateNewDeploy('buildDir', newName);
      }} />
  )
}

const mapStateToProps = (state: AppState) => {
  return {

  }
}

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
  return {
    updateNewDeploy: (field: keyof DeployArgs, value: string) => dispatch(FormActions.updateNewDeploy({ field, value }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildStage);