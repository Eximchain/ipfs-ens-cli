import React, { FC } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { BoxPads } from '.'

export interface LoaderProps {
  message: string,
  noPad?:boolean
}
export const Loader:FC<LoaderProps> = ({ message, noPad }) => {
  const coreSpinner = (
    <>
      <Box marginRight={1}>
        <Spinner type='dots' />
      </Box>
      <Text>{ message }</Text>
    </>
  )
  if (noPad) return coreSpinner;
  return (
    <BoxPads>
      { coreSpinner }
    </BoxPads>
  )
}

export default Loader;