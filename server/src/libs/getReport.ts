import childProcess from 'child_process';
import util from 'util';

const exec = util.promisify(childProcess.exec);

export const getReport = async (owner: string, repoName: string, from: Date, to: Date, author: string) => {
  // FIXME: hack
  //   const message = await exec(`python3 ${owner} ${repoName} ${from} ${to} ${author}`);
  await new Promise(resolve => setTimeout(resolve, 1000)) 
  return 'バグ修正';
};
