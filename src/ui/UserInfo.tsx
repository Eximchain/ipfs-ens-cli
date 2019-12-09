import React, { FC } from 'react';
import { GitTypes } from '@eximchain/ipfs-ens-types/spec/deployment'
import { ItemList } from './helpers';

interface UserInfoProps {
  user: GitTypes.User
}

export const UserInfo:FC<UserInfoProps> = ({ user }) => {
  const { login, name, email, type, public_repos } = user;
  return (
    <ItemList items={{ login, name, email, type, public_repos }} />
  )
}