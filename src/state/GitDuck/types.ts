import { GitTypes } from '@eximchain/ipfs-ens-types/spec/deployment';

export interface GitState {
  auth: GitTypes.Auth | null
  authLoading: boolean
  user: GitTypes.User | null
  userLoading: boolean
  repos: GitTypes.Repo[]
  reposLoading: boolean
  branches: {
    [key:string]: GitTypes.Branch[]
  }
  branchesLoading: boolean
  error: any | null
}