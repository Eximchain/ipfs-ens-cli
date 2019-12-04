import React from 'react';
// @ts-ignore
import BigText from 'ink-big-text';
import { Argv } from "yargs";
import { render, Box } from 'ink';
import { ArgShape } from "../cli";
import { Rows, ChevronText, ItemList } from '../ui';

export const command = 'onboarding';

export const desc = false;

export function builder(args:Argv) {

}

export function handler(args:ArgShape) {
  process.env.NODE_ENV = 'production';
  render(
    <Box margin={1}>
      IPFS-ENS Deployer
      <Rows>
        <BigText text='IPFS-ENS Deployer' 
          lineHeight={2} 
          space={false} 
          colors={['#267EDC','#267EDC','#267EDC']}
          font='chrome' />
        <ChevronText>
          Welcome to the IPFS-ENS Deployer by Eximchain!  Get ready to send your site to the world's only truly decentralized hosting system.
        </ChevronText>
        <ChevronText>
          This tool is powered by GitHub; for your peace of mind, your auth data is only ever saved on your local machine.
        </ChevronText>
        <ChevronText>
          Here are some sample commands to help you get started.  Happy hacking!
        </ChevronText>
        <ItemList items={{
          'deployer': 'Get overall usage info',
          'deployer login': 'Authorize the IPFS-ENS Deployer on GitHub and get a code to authenticate your machine',
          'deployer create': 'Wizard to interactively create a new IPFS-ENS deployment'
        }} />
      </Rows>
    </Box>
  )
}