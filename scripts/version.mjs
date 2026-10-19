import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const release = /^v0\.(\d+)$/;
export function nextTag(tags) {
  const versions = tags
    .filter((t) => release.test(t))
    .map((t) => Number(t.match(release)[1]));
  return `v0.${versions.length ? Math.max(...versions) + 1 : 0}`;
}
export function tagForCommit(sameCommitTags, allTags) {
  const existing = sameCommitTags
    .filter((t) => release.test(t))
    .sort((a, b) => Number(b.slice(3)) - Number(a.slice(3)));
  return existing[0] ?? nextTag(allTags);
}
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
export function releaseCommit(sha) {
  if (!/^[a-f0-9]{40}$/.test(sha))
    throw new Error("A full verified commit SHA is required.");
  git("cat-file", "-e", `${sha}^{commit}`);
  for (let attempt = 0; attempt < 8; attempt++) {
    const refs = git("ls-remote", "--tags", "origin")
      .split("\n")
      .filter(Boolean)
      .map((line) => line.split(/\s+/))
      .filter(([, ref]) => !ref.endsWith("^{}"));
    const all = refs.map(([, ref]) => ref.replace("refs/tags/", ""));
    const same = refs
      .filter(([hash]) => hash === sha)
      .map(([, ref]) => ref.replace("refs/tags/", ""));
    const tag = tagForCommit(same, all);
    if (same.includes(tag)) return tag;
    try {
      git("push", "origin", `${sha}:refs/tags/${tag}`);
      return tag;
    } catch (error) {
      if (attempt === 7) throw error;
    }
  }
  throw new Error("Could not allocate a release version.");
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const tag = releaseCommit(process.env.GITHUB_SHA ?? "");
  if (process.env.GITHUB_OUTPUT)
    appendFileSync(process.env.GITHUB_OUTPUT, `tag=${tag}\n`);
  console.log(tag);
}
