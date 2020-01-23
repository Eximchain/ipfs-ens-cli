# ipfs-ens-cli

Deploy your static site from GitHub to IPFS, accessible through a `.eth` subdomain (i.e. `yoursite.hosted.eth`).

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