import childProcess from 'child_process';
import util from 'util';

const exec = util.promisify(childProcess.exec);

export const getReport = async (owner_repo: string, author: string, from: Date, to: Date) => {
  const github_api_key = process.env.GITHUB_API_TOKEN;
  const chatgpt_api_key = process.env.CHATGPT_API_TOKEN;
  const complete_engine = process.env.COMPLETE_ENGINE;
  console.log("getReportOrder:", owner_repo, author, from, to)
  // FIXME: hack
  const message = await exec(
    `GITHUB_API_TOKEN=${github_api_key} \
     OPENAI_API_KEY=${chatgpt_api_key} \
     COMPLETE_ENGINE=${complete_engine} \
    python3 python/autocomplete.py ${owner_repo} ${author} ${from.toISOString()} ${to.toISOString()}`
  );
  // await new Promise(resolve => setTimeout(resolve, 1000))
  return message.stdout;
};
