import { reducerWithInitialState } from "typescript-fsa-reducers";
import { shallowMerge } from '../sharedTypes';
import { 
  saveAuth, saveBranches, saveRepos, saveUser, setError, resetAuth,
  setAuthLoading, setBranchesLoading, setReposLoading, setUserLoading
} from './actions';
import { GitState } from './types';

const initialState:GitState = {
  auth: null,
  user: null,
  repos: [],
  branches: {},
  error: null,
  authLoading: false,
  userLoading: false,
  reposLoading: false,
  branchesLoading: false
}

export const GitReducer = reducerWithInitialState(initialState)
  .case(resetAuth, (state) => shallowMerge(state, { auth: null, user: null }))
  .case(saveAuth, (state, auth) => shallowMerge(state, { auth }))
  .case(setAuthLoading, (state, authLoading) => shallowMerge(state, { authLoading }))
  .case(saveUser, (state, user) => shallowMerge(state, { user }))
  .case(setUserLoading, (state, userLoading) => shallowMerge(state, { userLoading }))
  .case(saveRepos, (state, repos) => shallowMerge(state, { repos }))
  .case(setReposLoading, (state, reposLoading) => shallowMerge(state, { reposLoading }))
  .case(saveBranches, (state, { repo, branches }) => shallowMerge(state, {
    branches: shallowMerge(state.branches, { [repo] : branches })
  }))
  .case(setBranchesLoading, (state, branchesLoading) => shallowMerge(state, { branchesLoading }))
  .case(setError, (state, error) => shallowMerge(state, { error }))

export default GitReducer;