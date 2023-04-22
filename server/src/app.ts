import express from "express";
import childProcess from "child_process";
import util from "util";

const exec = util.promisify(childProcess.exec);

const app = express();

app.get("/", async (req, res) => {
  const ls = await exec("ls -1");
  await res.json({ msg: "hello express!" + ls.stdout });
});

export default app;
