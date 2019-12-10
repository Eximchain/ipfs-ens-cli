import { DeployArgs } from '@eximchain/ipfs-ens-types/spec/deployment';

export interface FormState {
  newDeploy: DeployArgs
  loading: boolean
  error: null | any
}