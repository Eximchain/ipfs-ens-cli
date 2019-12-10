import { DeployItem, DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

export interface DeployState {
  deploys : {
    [name:string] : DeployItem
  }
  deploysLoading: boolean
  error : null | any
  apiUrl : string
}