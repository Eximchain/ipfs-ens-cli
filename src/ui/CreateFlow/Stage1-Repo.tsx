import React, { useEffect, FC, useState } from 'react';
import { connect } from 'react-redux';
import { GitTypes } from '@eximchain/ipfs-ens-types/spec/deployment';
import QuickSearchInput from 'ink-quicksearch-input';

import { GitSelectors, GitActions } from '../../state';
import { AppState } from '../../state/store';
import { AsyncDispatch } from '../../state/sharedTypes';
import { Rows, ChevronText, ConfirmAction, Loader, BoxPads } from '../helpers';
import { FormActions } from '../../state/FormDuck';

interface StateProps {
  repos: GitTypes.Repo[],
  reposLoading: boolean
}

interface DispatchProps {
  fetchRepos: () => void
  selectRepo: (owner: string, repo: string) => void
}

export interface RepoStageProps {

}

const RepoStage: FC<RepoStageProps & StateProps & DispatchProps> = (props) => {
  const { repos, fetchRepos, selectRepo, reposLoading } = props;
  const [selectedRepo, setSelectedRepo] = useState('');

  useEffect(function fetchReposOnMount() {
    fetchRepos()
  }, []);

  if (selectedRepo === '') {
    const repoOptions = repos.map(repo => {
      const { full_name } = repo;
      return {
        label: `@${full_name}`,
        value: `${full_name}`
      }
    })
    return (
      <Rows>
        {
          reposLoading ? (
            <Loader key='looking-for-repos' noPad message={`Found ${repos.length} repos in memory, checking for more...`} />
          ) : (
            <ChevronText key='please-select-repo'>
              Please select a repository ({repos.length} found):
            </ChevronText>
          )
        }
        <QuickSearchInput
          label='» Name (type to filter)'
          limit={15}
          items={repoOptions}
          key='select-repo-input'
          onSelect={({ value }) => setSelectedRepo(value as string)} />
      </Rows>
    )
  }

  return (
    <ConfirmAction
      action={`Are you sure you want to use @${selectedRepo} for this deployment?`}
      confirm={() => {
        const [owner, repo] = selectedRepo.split('/');
        selectRepo(owner, repo);
      }}
      key='confirm-repo-choice'
      deny={() => setSelectedRepo('')} />
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    repos: GitSelectors.getRepos()(state),
    reposLoading: GitSelectors.isLoading()(state).repos
  }
}

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
  return {
    fetchRepos: () => dispatch(GitActions.fetchRepos()),
    selectRepo: (owner: string, repo: string) => {
      dispatch(FormActions.updateMultiple([
        ['repo', repo],
        ['owner', owner]
      ]))
      dispatch(GitActions.fetchBranches(owner, repo));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RepoStage);