import React, { FC, useEffect } from 'react';
import { useResource } from 'react-request-hook';
import APIClient from '@eximchain/ipfs-ens-api-client';
import { useDispatch, useSelector } from 'react-redux';
import { GitActions, GitSelectors, DeployActions, DeploySelectors } from '../../state';
import { Loader, ChevronText, Rows, ErrorBox } from '../helpers';
import { UserInfo } from '../UserInfo';

export interface SaveUserProps {
  code: string
  API: APIClient
}

export const SaveUser:FC<SaveUserProps> = (props) => {
  const { code } = props;
  const dispatch = useDispatch();

  const gitLoading = useSelector(GitSelectors.isLoading());
  const token = useSelector(GitSelectors.getToken());
  const user = useSelector(GitSelectors.getUser());
  const error = useSelector(GitSelectors.getErr());

  useEffect(function fetchTokenOnMount(){
    console.log(`Firing a fetchAuth action w/ code ${code}...`)
    dispatch(GitActions.fetchAuth(code))
  }, [dispatch])

  useEffect(function fetchUserWithToken(){
    if (user || gitLoading.auth || gitLoading.user) return;
    if (token) dispatch(GitActions.fetchUser())
  }, [dispatch, user, token, gitLoading]);

  if (error) {
    return <ErrorBox errMsg={JSON.stringify(error, null, 2)} />
  }

  if (!token) {
    return <Loader message='Fetching your OAuth token...' />
  }

  if (!user) {
    return <Loader message='Got your token, caching your user profile...' />
  }

  return (
    <Rows>
      <ChevronText>Congrats, you're all logged in!</ChevronText>
      <UserInfo {...{ user }} />
    </Rows>
  )

}

export default SaveUser;