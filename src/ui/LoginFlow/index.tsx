import React, { FC, useEffect } from 'react';
import APIClient from '@eximchain/ipfs-ens-api-client';
import { useResource } from 'react-request-hook';
import open from 'open';
import { ChevronText, ErrorBox, Rows, Loader, Select } from '../helpers';
import { isSuccessResponse } from '@eximchain/api-types/spec/responses';

export interface LoginFlowProps {
  API: APIClient
}

export const LoginFlow:FC<LoginFlowProps> = ({ API }) => {
  const [loginUrl, getLoginUrl] = useResource(API.deploys.loginUrl.resource);

  useEffect(function autoFetchLoginUrl(){
    getLoginUrl();
  }, []);

  const { data, error, isLoading } = loginUrl;

  if (isLoading || (!data && !error)) {
    return <Loader message="Getting the deployer's login URL..." />
  }
  if (error) {
    return <ErrorBox operation={`GET /login`} permanent errMsg={JSON.stringify(error, null, 2)} />
  }
  if (data && isSuccessResponse(data)) {
    const url = data.data.loginUrl;
    return (
      <Rows>
        <ChevronText>Got it!  We're about to forward you to GitHub, where you can authorize this app to read your repos.</ChevronText>
        <ChevronText>Then you'll be redirected to our login page, where you'll find your one-time code.</ChevronText>
        <ChevronText>Copy that code back over here, then we'll fetch and save your OAuth token.</ChevronText>
        <ChevronText>This token is persistent (only need to log in once), and it will only be saved on your local machine.</ChevronText>
        <Select 
          items={[{ value: 'Yes', label: "Let's get started!"}]}
          onSelect={()=>open(url)}
          label={'Are you ready to go?'}/>
      </Rows>
    )
  }
  return (
    <>Never expect to see this...</>
  )
}