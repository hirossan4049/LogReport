import childProcess from 'child_process';
import util from 'util';

const exec = util.promisify(childProcess.exec);

export const getReport = async (owner: string, repoName: string, from: Date, to: Date, author: string) => {
  const github_api_key = process.env.GITHUB_API_TOKEN;
  const chatgpt_api_key = process.env.CHATGPT_API_TOKEN;
  // FIXME: hack
  // const message = await exec(`python3 ${owner} ${repoName} ${from.toISOString()} ${to.toISOString()} ${author}`);
  const message = await exec(
    `GITHUB_API_TOKEN=${github_api_key} OPENAI_API_KEY=${chatgpt_api_key} python3 python/autocomplete.py ${owner} ${repoName} ${from.toISOString()} ${to.toISOString()} ${author}`
  );
  // await new Promise(resolve => setTimeout(resolve, 1000))
  return message.stdout;
};
