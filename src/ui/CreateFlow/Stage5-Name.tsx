import React, { FC } from 'react';
import { ArgPrompt } from '..';
import { connect } from 'react-redux';
import { DeployActions, AppState, FormActions } from '../../state';
import { AsyncDispatch } from '../../state/sharedTypes';
import { DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

export interface NameStageProps {

}

interface StateProps {
  
}

interface DispatchProps {
  updateNewDeploy: (field:keyof DeployArgs, value:string) => void
}

const NameStage: FC<NameStageProps & StateProps & DispatchProps> = (props) => {
  const { updateNewDeploy } = props;


  // TODO: Validate the availability of the desired ENS name

  return (
    <ArgPrompt name='ensName' 
      label={"What ENS subdomain would you like?  This is the [something] in [something].hosted.eth."}
      withResult={(newName) => {
        updateNewDeploy('ensName', newName);
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

export default connect(mapStateToProps, mapDispatchToProps)(NameStage);