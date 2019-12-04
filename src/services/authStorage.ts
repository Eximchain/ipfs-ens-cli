import path from 'path';
import fs from 'fs';
import { GitTypes } from '@eximchain/ipfs-ens-types/spec/deployment'

export interface AuthFile {
  token: string | null
  username: string | null
  userData: GitTypes.User | null
}

export const AUTH_FILENAME = 'dappbotAuthData.json';
export const AUTH_FILE_PATH = path.resolve(__dirname, `./${AUTH_FILENAME}`);

export function newAuthFile(){
  return {
    token: null,
    username: null,
    userData: null
  }
}

export function initAuthFile() {
  if (!fs.existsSync(AUTH_FILE_PATH)) {
    fs.writeFileSync(AUTH_FILE_PATH, JSON.stringify(newAuthFile(), null, 2));
  }
}

export function saveAuthToFile(newData:AuthFile) {
  fs.writeFileSync(AUTH_FILE_PATH, JSON.stringify(newData, null, 2));
}