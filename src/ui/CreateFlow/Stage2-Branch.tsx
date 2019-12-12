
import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { FormSelectors, FormActions, GitSelectors, GitActions } from '../../state';
import { Loader, Rows } from '../helpers';
import QuickSearch from 'ink-quicksearch-input';

export interface BranchStageProps {
  repo: string
  owner: string
}

export const BranchStage: FC<BranchStageProps> = (props) => {
  const { repo, owner } = props;
  const branches = useSelector(GitSelectors.getBranches())[`${owner}/${repo}`];
  const loading = useSelector(GitSelectors.isLoading()).branches;
  const dispatch = useDispatch();

  if (!branches || loading) return (
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
        onSelect={({ value }) => dispatch(FormActions.update({
          field: 'branch',
          value: value as string
        }))} />
    </Rows>
  )
}

export default BranchStage;