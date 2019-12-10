import React, { useState, FC } from 'react';
import { connect } from 'react-redux';
import { GitTypes, DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

import { DeployActions, DeploySelectors, FormActions } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { ArgPrompt, ConfirmAction } from '../helpers';

interface StateProps {
  
}

interface DispatchProps {
  updateNewDeploy: (field:keyof DeployArgs, value:string) => void
}

export interface BuildStageProps {
  buildScript: string
}

const BuildStage: FC<BuildStageProps & StateProps & DispatchProps> = (props) => {
  const { updateNewDeploy, buildScript } = props;
  const [needToSpecify, setNeedToSpecify] = useState(false);

  if (!needToSpecify && buildScript === 'react-scripts build') {
    return (
      <ConfirmAction action={"It looks like you're using create-react-app.  Your build will end up in /build, right?"} 
        confirm={() => updateNewDeploy('buildDir', '/build')}
        deny={()=>setNeedToSpecify(true)}
        />
    )
  }

  return (
    <ArgPrompt name='build-directory' 
      label={"What directory will your build end up in?  Start with a slash, this is relative to your repository root."}
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
    updateNewDeploy: (field:keyof DeployArgs, value:string) => dispatch(FormActions.updateNewDeploy({ field, value }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildStage);