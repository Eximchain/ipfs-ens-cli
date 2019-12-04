import path from 'path';
import fs from 'fs';
import { ArgShape } from '../cli';

/**
 * Middlware: Listen for any options whose name ends in "Path", and if found,
 * read the file's contents as a string and add it as an argument
 * whose name ends in "File".  For instance, "authPath" will yield
 * an "authFile" string, which can be JSON.parse()d to get the
 * actual authData.
 * @param args 
 */
export function loadFileFromPath(args:ArgShape): ArgShape {
  const pathKeys = Object.keys(args).filter(key => key.indexOf('Path') > -1);
  pathKeys.forEach(pathKey => {
    const fullPath = path.resolve(process.cwd(), args[pathKey]);
    if (!fs.existsSync(fullPath)) throw new Error(`The specified path (${pathKey}, ${args[pathKey]}) does not have a file!`);
    const fileKey = `${pathKey.slice(0, pathKey.indexOf('Path'))}File`;
    args[fileKey] = fs.readFileSync(fullPath).toString();
  })
  return args;
}

/**
 * Accepts one or more file names (string or string array)
 * and a directory, checks whether those files exist in said
 * directory.  File names do not need relative path prefixes.
 * If multiple names are provided, function returns true if
 * **any** of the files are present.
 * 
 * @param fileName 
 * @param dir 
 */
export function pathExists(fileName:string|string[], dir:string):boolean {
  const exists = (name:string) => fs.existsSync(path.resolve(dir, name))
  if (Array.isArray(fileName)) {
    return fileName.some(file => exists(file))
  } else {
    return exists(fileName);
  }
}