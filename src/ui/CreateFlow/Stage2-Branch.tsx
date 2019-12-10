
import React, { useEffect, FC, useState } from 'react';
import { Text } from 'ink';
import { connect, useSelector } from 'react-redux';
import { GitTypes } from '@eximchain/ipfs-ens-types/spec/deployment';

import { FormSelectors, FormActions, GitSelectors, GitActions } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { Loader, Rows, Select, ConfirmAction } from '../helpers';
import QuickSearch from 'ink-quicksearch-input';

interface StateProps {
  branches: GitTypes.Branch[]
  branchesLoading: boolean
  repo: string
  owner: string
}

interface DispatchProps {
  fetchBranches: (owner: string, repo: string) => void
  selectBranch: (name: string) => void
}

export interface BranchStageProps {

}

const BranchStage: FC<BranchStageProps & StateProps & DispatchProps> = (props) => {
  const { branches, branchesLoading, repo, owner, fetchBranches, selectBranch } = props;

  if (!branches || branchesLoading) return (
    <Loader message={'Loading branches, please wait...'} />
  )

  return (
    <Rows>
      <QuickSearch label={'» Name (type to filter)'}
        limit={15}
        items={branches.map((branch) => {
          const name = branch.name;
          return { label: name, value: name }
        })}
        onSelect={({ value }) => selectBranch(value as string)} />
    </Rows>
  )
}

const mapStateToProps = (state: AppState) => {
  const { repo, owner } = FormSelectors.getNewDeploy()(state);
  return {
    branches: GitSelectors.getBranches()(state)[`${owner}/${repo}`],
    branchesLoading: GitSelectors.isLoading()(state).branches,
    repo, owner
  }
}

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
  return {
    fetchBranches: (owner: string, repo: string) => dispatch(GitActions.fetchBranches(owner, repo)),
    selectBranch: (name: string) => {
      dispatch(FormActions.updateNewDeploy({ field: 'branch', value: name }));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BranchStage);