import fs from 'fs';
import path from 'path';

export function cleanExit(message:string) {
  console.log(`\n${message}\n`)
  process.exit(1);
}