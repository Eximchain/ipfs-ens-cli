# ipfs-ens-cli

Deploy your static site from GitHub to IPFS, accessible through a `.eth` subdomain (i.e. `yoursite.hosted.eth`).

## Related Repositories

- [eximchain-notes/ipfs-ens](https://github.com/Eximchain/eximchain-notes/tree/master/ipfs-ens): System diagrams
- [terraform-ipfs-ens](https://github.com/Eximchain/terraform-ipfs-ens): Terraform to create infrastructure
- [ipfs-ens-types](https://github.com/Eximchain/ipfs-ens-types): Shared types package
- [ipfs-ens-api-client](https://github.com/Eximchain/ipfs-ens-api-client): Easy client for calling our IPFS-ENS API
- [ipfs-ens-lambda](https://github.com/Eximchain/ipfs-ens-lambda): Source for all of the Lambda functions
- [ipfs-ens-spa](https://github.com/Eximchain/ipfs-ens-spa): create-react-app used for OAuth redirects during login

## Setup & Usage

Install this private client from `npm` and view the set of commands available:

```shell
npm install --global @eximchain/ipfs-ens-cli

deployer --help

Usage: deployer <command>

Commands:
  deployer.js create          Interactive command for creating a new deployment.
  deployer.js list            View a list of all of your deployments.
  deployer.js login           Interactive command to login, authorize the Deployer, and save the auth to your machine.
  deployer.js read <EnsName>  Read the details about one of your deployments.
  deployer.js whoami          View the user which is currently logged in.

Options:
  --version, -v  Show version number    
  --config       Path to a JSON config file; defaults to './ipfsEnsConfig.json'.
                 All of the file's keys will be treated like options.

Made by Eximchain Pte. Ltd.
```

## Development

If you are going to do active development on this repository, there are a few things you should know:

1. You can clone this library, run `npm i; npm run build`, and then run it by calling `node build/deployer.ts [command]`.  This gets around having to reinstall the library globally after each change.
2. Two of the dependent libraries have outdated definitions from `DefinitelyTyped`.  After running the first `npm install`, you may get a Typescript compiler error.  Go to `./node_modules/@types/` and find the `ink-table` and `ink-spinner` directories.  Their index files import `Component` from `ink.`  Instead import it from `React` and those errors will go away.
3. If you need to modify the underlying [api-types](https://github.com/Eximchain/api-types), [ipfs-ens-types](https://github.com/Eximchain/ipfs-ens-types), or [ipfs-ens-api-client](https://github.com/Eximchain/ipfs-ens-api-client) packages, and their directories are siblings to this project, then you can install your local version via: `npm install ../ipfs-ens-types`.
4. You can change the API URL using a hidden command: `deployer api [newApiUrl]`.  If you omit the new URL, it will display the current one.
5. If you want to get an overall view of how this project is structured, take a look at its [Dev Diary](https://medium.com/eximchain/dev-diary-5-tips-for-building-beautiful-clis-with-node-js-yargs-ink-16d184ea0d14).
6. This uses Redux for state management & persistence.  If you've never used Redux before, take a look at our [Redux primer](https://github.com/Eximchain/eximchain-notes/blob/master/redux-primer.md) in [`eximchain-notes`](https://github.com/eximchain/eximchain-notes).

### Replacement index files

#### ./node_modules/@types/ink-table/index.d.ts

```typescript
// Type definitions for ink-table 1.0
// Project: https://github.com/maticzav/ink-table#readme
// Definitions by: Łukasz Ostrowski <https://github.com/lukostry>
// Definitions: https://github.com/DefinitelyTyped/
// TypeScript Version: 2.8

import { FC, Component } from 'react';


export interface TableProps {
    cell?: typeof Cell;
    data?: ReadonlyArray<object>;
    header?: typeof Header;
    padding?: number;
    skeleton?: typeof Skeleton;
}

export const Cell: FC<{ children: Component }>;
export const Header: FC<{ children: Component }>;
export const Skeleton: FC<{ children: Component }>;

declare const Table: FC<TableProps>;

export default Table;
```

#### ./node_modules/@types/ink-spinner/index.d.ts

```typescript
// Type definitions for ink-spinner 2.0
// Project: https://github.com/vadimdemedes/ink-spinner#readme
// Definitions by: Łukasz Ostrowski <https://github.com/lukostry>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

import { Chalk } from 'chalk';
import * as cliSpinners from 'cli-spinners';
import { Component } from 'react';

type StringifyPartial<T> = {
    [P in keyof T]?: string;
};

type BooleansPartial<T> = {
    [P in keyof T]?: boolean;
};

type TupleOfNumbersPartial<T> = {
    [P in keyof T]?: [number, number, number];
};
// Omit taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type ChalkColorModels = Pick<Chalk, 'rgb' | 'hsl' | 'hsv' | 'hwb' | 'bgRgb' | 'bgHsl' | 'bgHsv' | 'bgHwb'>;
type ChalkKeywordsAndHexes = Pick<Chalk, 'keyword' | 'hex' | 'bgKeyword' | 'bgHex'>;
type ChalkCommons = Omit<Chalk, keyof ChalkColorModels | keyof ChalkKeywordsAndHexes | 'constructor' | 'level' | 'enabled'>;

interface SpinnerProps {
    type?: cliSpinners.SpinnerName;
}

type ChalkProps = BooleansPartial<ChalkCommons>
    & StringifyPartial<ChalkKeywordsAndHexes>
    & TupleOfNumbersPartial<ChalkColorModels>;

declare class Spinner extends Component<SpinnerProps & ChalkProps> { }

export = Spinner;
```