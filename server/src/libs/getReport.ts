import childProcess from "child_process";
import util from "util";

const exec = util.promisify(childProcess.exec);

type Props = {
  owner: string;
  repoName: string;
  from: Date;
  to: Date;
  author: string;
};

export const getReport = async (
  { owner, repoName, from, to, author }: Props,
) => {
  // FIXME: hack
  //   const message = await exec(`python3 ${owner} ${repoName} ${from} ${to} ${author}`);
  return "バグ修正";
};
