import { exec } from "child_process";
import { existsSync } from "fs";
import path from "path";

import { promisify } from "util";
const execPromise = promisify(exec);

import { addTdPrefix, FRAMEWORKS, getDirname, isChatFramework, isUniapp } from "../common";
import { TD_REPOS_ROOT } from "./utils/path";

const __dirname = getDirname(import.meta.url);

const TENCENT_GITHUB_URL = "https://github.com/Tencent/";

// Chat 组件和基本组件在同一个仓库；uniapp 组件源码在 tdesign-miniprogram 仓库中
const TD_REQUIRED_REPOS = ["common", ...FRAMEWORKS, "icons"].filter(
  // @ts-ignore
  (repo) => !isChatFramework(repo) && !isUniapp(repo)
);

(async function main() {
  await prepareTDesignRepos();
  await extractDocs();
})();

async function gitClone(repoUrl: string) {
  console.log(`Cloning repository from ${repoUrl}...`);
  await execPromise(`mkdir -p ${TD_REPOS_ROOT} && cd ${TD_REPOS_ROOT} && git clone ${repoUrl} --depth=1`);
  console.log("Repository cloned successfully!\n");
}

async function gitPull(repoPath: string) {
  console.log(`Pulling repository from ${repoPath}...`);
  await execPromise(`cd ${repoPath} && git switch develop && git pull`);
  console.log("Repository pulled successfully!\n");
}

async function prepareTDesignRepos() {
  console.log(`TDesign repos root: ${TD_REPOS_ROOT}`);
  for (const repo of TD_REQUIRED_REPOS) {
    const localRepoPath = path.join(TD_REPOS_ROOT, addTdPrefix(repo));
    const repoUrl = `${TENCENT_GITHUB_URL}${addTdPrefix(repo)}`;
    if (existsSync(localRepoPath)) {
      await gitPull(localRepoPath);
    } else {
      await gitClone(repoUrl);
    }
  }
}

async function executeTypeScript(scriptPath: string) {
  const { stdout, stderr } = await execPromise(`tsx ${scriptPath}`);
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
}

async function extractDocs() {
  await executeTypeScript(path.join(__dirname, "docs/index.ts"));
  const { stdout, stderr } = await execPromise("npm run build:snap", { cwd: path.join(__dirname, "..") });
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
  await executeTypeScript(path.join(__dirname, "dom/index.ts"));
  await executeTypeScript(path.join(__dirname, "icon/index.ts"));
}
