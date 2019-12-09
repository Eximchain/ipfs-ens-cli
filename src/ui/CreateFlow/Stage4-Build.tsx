import React, { useState, FC } from 'react';
import { connect } from 'react-redux';
import { GitTypes, DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

import { DeployActions, DeploySelectors } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';

interface StateProps {
  
}

interface DispatchProps {
  updateNewDeploy: (field:keyof DeployArgs, value:string) => void
}

export interface BuildStageProps {

}

const BuildStage: FC<BuildStageProps & StateProps & DispatchProps> = (props) => {
  const { updateNewDeploy } = props;

  const [ensState, setEnsState] = useState('');
  const [buildDir, setBuildDir] = useState('./build');

  // TODO: Validate the availability of the desired ENS name

  function proceed(){
    updateNewDeploy('ensName', ensState);
    updateNewDeploy('buildDir', buildDir);
  }

  return (
    <>
      
    </>
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    
  }
}

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
  return {
    updateNewDeploy: (field:keyof DeployArgs, value:string) => dispatch(DeployActions.updateNewDeploy({ field, value }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildStage);