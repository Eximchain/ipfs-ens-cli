import { DeployItem, Transitions, DeployStates } from '@eximchain/ipfs-ens-types/spec/deployment';

export interface DeployState {
  deploys : {
    [name:string] : DeployItem
  }
  deploysLoading: boolean
  error : null | any
  apiUrl : string
}

export const StateNum:Record<DeployStates, number> = {
  [DeployStates.FETCHING_SOURCE] : 1,
  [DeployStates.BUILDING_SOURCE] : 2,
  [DeployStates.DEPLOYING_IPFS] : 3,
  [DeployStates.REGISTERING_ENS]: 4,
  [DeployStates.SETTING_RESOLVER_ENS]: 5,
  [DeployStates.SETTING_CONTENT_ENS]: 6,
  [DeployStates.PROPAGATING]: 7,
  [DeployStates.AVAILABLE]: 8
}

export const StateToTransition:Record<DeployStates, Transitions.Names.All> = {
  [DeployStates.FETCHING_SOURCE]: Transitions.Names.All.SOURCE,
  [DeployStates.BUILDING_SOURCE]: Transitions.Names.All.BUILD,
  [DeployStates.DEPLOYING_IPFS]: Transitions.Names.All.IPFS,
  [DeployStates.REGISTERING_ENS]: Transitions.Names.All.ENS_REGISTER,
  [DeployStates.SETTING_RESOLVER_ENS]: Transitions.Names.All.ENS_SET_RESOLVER,
  [DeployStates.SETTING_CONTENT_ENS]: Transitions.Names.All.ENS_SET_CONTENT,
  [DeployStates.PROPAGATING]: Transitions.Names.All.ENS_SET_CONTENT,
  [DeployStates.AVAILABLE]: Transitions.Names.All.ENS_SET_CONTENT
}